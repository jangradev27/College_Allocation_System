const Room = require('../models/Rooms');
const Teacher = require('../models/Teacher');
const Allocation = require('../models/Allocation');
const Institution = require('../models/User');

class AllocationService {
    // Main allocation function
    async allocateRoomsAndTeachers(allocationData) {
        try {
            const { shift, courses, institutionId, date } = allocationData;

            // Validate input
            const validation = this.validateInput(allocationData);
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            if (!date || isNaN(new Date(date))) {
                throw new Error('Valid date is required');
            }

            // Verify institution exists
            const institution = await Institution.findById(institutionId);
            if (!institution) {
                throw new Error('Institution not found');
            }

            // Get available rooms and teachers
            const availableRooms = await this.getAvailableRooms(institutionId);
            const availableTeachers = await this.getAvailableTeachers(institutionId);

            // Total students
            const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);
            const totalCapacity = availableRooms.reduce((sum, room) => sum + room.Capacity, 0);

            if (totalCapacity < totalStudents) {
                throw new Error(`Insufficient room capacity. Need ${totalStudents} seats but only ${totalCapacity} available.`);
            }

            // Perform allocation
            const allocationResult = this.performAllocation(courses, availableRooms, availableTeachers);

            // Save allocation
            const savedAllocation = await this.saveAllocation({
                shift,
                date,
                courses: courses.map(c => c.name),
                institutionId,
                ...allocationResult,
                totalStudents
            });

            return {
                success: true,
                allocation: savedAllocation,
                message: 'Allocation completed successfully'
            };

        } catch (error) {
            console.log(error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Validate input
    validateInput(data) {
        const errors = [];

        if (!data.shift || !['morning', 'afternoon'].includes(data.shift)) {
            errors.push('Valid shift (morning/afternoon) is required');
        }

        if (!data.institutionId) {
            errors.push('Institution ID is required');
        }

        if (!data.courses || !Array.isArray(data.courses) || data.courses.length === 0) {
            errors.push('At least one course is required');
        }

        data.courses?.forEach((course, index) => {
            if (!course.name || !course.name.trim()) {
                errors.push(`Course ${index + 1} name is required`);
            }
            if (!course.students || course.students <= 0) {
                errors.push(`Course ${index + 1} must have at least 1 student`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    async getAvailableRooms(institutionId) {
        const institution = await Institution.findById(institutionId).populate('Rooms');
        if (!institution) throw new Error('Institution not found');

        return institution.Rooms
            .filter(room => room.IsAvailable)
            .sort((a, b) => b.Capacity - a.Capacity);
    }

    async getAvailableTeachers(institutionId) {
        const institution = await Institution.findById(institutionId).populate('Teachers');
        if (!institution) throw new Error('Institution not found');

        return institution.Teachers
            .filter(t => t.IsAvailable && t.RemainingDuty > 0)
            .sort((a, b) => b.RemainingDuty - a.RemainingDuty);
    }

    performAllocation(courses, availableRooms, availableTeachers) {
        const allocatedRooms = [];
        const allocatedTeachers = [];
        const roomDetails = [];
        const teacherAssignments = [];

        let remainingStudents = courses.reduce((sum, course) => sum + course.students, 0);
        let courseQueue = this.prepareCourseQueue(courses);

        for (let i = 0; i < availableRooms.length && remainingStudents > 0; i++) {
            const room = availableRooms[i];
            const roomCapacity = Math.min(room.Capacity, remainingStudents);
            const courseDistribution = this.distributeCourses(courseQueue, roomCapacity);

            if (courseDistribution.studentsAllocated > 0) {
                allocatedRooms.push(room._id);
                roomDetails.push({
                    roomId: room._id,
                    allocatedStudents: courseDistribution.studentsAllocated,
                    courseDistribution: courseDistribution.distribution
                });

                remainingStudents -= courseDistribution.studentsAllocated;
                courseQueue = courseDistribution.updatedQueue;

                const teachersForRoom = this.assignTeachersToRoom(availableTeachers, room._id, 2);
                allocatedTeachers.push(...teachersForRoom.map(t => t._id));
                teacherAssignments.push(...teachersForRoom.map(teacher => ({
                    teacherId: teacher._id,
                    assignedRoom: room._id
                })));
            }
        }

        if (remainingStudents > 0) {
            throw new Error(`Could not allocate ${remainingStudents} students due to insufficient capacity`);
        }

        if (allocatedTeachers.length < allocatedRooms.length) {
            throw new Error('Insufficient teachers available for supervision');
        }

        return {
            allocatedRooms,
            allocatedTeachers,
            roomDetails,
            teacherAssignments
        };
    }

    prepareCourseQueue(courses) {
        return courses.map(course => ({
            name: course.name,
            remainingStudents: course.students,
            totalStudents: course.students
        })).filter(course => course.remainingStudents > 0);
    }

    distributeCourses(courseQueue, roomCapacity) {
        const distribution = [];
        let studentsAllocated = 0;
        let remainingCapacity = roomCapacity;

        if (courseQueue.length > 0 && remainingCapacity > 0) {
            const firstCourse = courseQueue[0];
            const halfCapacity = Math.floor(roomCapacity / 2);
            const firstCourseStudents = Math.min(halfCapacity, firstCourse.remainingStudents, remainingCapacity);

            if (firstCourseStudents > 0) {
                distribution.push({
                    courseName: firstCourse.name,
                    students: firstCourseStudents,
                    section: 'First Half'
                });

                firstCourse.remainingStudents -= firstCourseStudents;
                studentsAllocated += firstCourseStudents;
                remainingCapacity -= firstCourseStudents;
            }
        }

        if (courseQueue.length > 1 && remainingCapacity > 0) {
            const secondCourse = courseQueue[1];
            const secondCourseStudents = Math.min(secondCourse.remainingStudents, remainingCapacity);

            if (secondCourseStudents > 0) {
                distribution.push({
                    courseName: secondCourse.name,
                    students: secondCourseStudents,
                    section: 'Second Half'
                });

                secondCourse.remainingStudents -= secondCourseStudents;
                studentsAllocated += secondCourseStudents;
                remainingCapacity -= secondCourseStudents;
            }
        }

        if (courseQueue.length === 1 && remainingCapacity > 0 && courseQueue[0].remainingStudents > 0) {
            const remainingFromFirst = Math.min(courseQueue[0].remainingStudents, remainingCapacity);

            if (remainingFromFirst > 0) {
                const existingEntry = distribution.find(d => d.courseName === courseQueue[0].name);
                if (existingEntry) {
                    existingEntry.students += remainingFromFirst;
                    existingEntry.section = 'Full Room';
                } else {
                    distribution.push({
                        courseName: courseQueue[0].name,
                        students: remainingFromFirst,
                        section: 'Full Room'
                    });
                }

                courseQueue[0].remainingStudents -= remainingFromFirst;
                studentsAllocated += remainingFromFirst;
            }
        }

        const updatedQueue = courseQueue.filter(course => course.remainingStudents > 0);

        return {
            distribution,
            studentsAllocated,
            updatedQueue
        };
    }

    assignTeachersToRoom(availableTeachers, roomId, numTeachers) {
        const assignedTeachers = [];

        for (let i = 0; i < Math.min(numTeachers, availableTeachers.length); i++) {
            const teacher = availableTeachers[i];
            if (teacher.RemainingDuty > 0) {
                assignedTeachers.push(teacher);
                teacher.RemainingDuty -= 1;
            }
        }

        assignedTeachers.forEach(assignedTeacher => {
            const index = availableTeachers.findIndex(t => t._id.equals(assignedTeacher._id));
            if (index > -1) availableTeachers.splice(index, 1);
        });

        return assignedTeachers;
    }

    async saveAllocation(allocationData) {
        
        const allocation = new Allocation({
            shift: allocationData.shift,
            Date: new Date(allocationData.date),
            Courses: allocationData.courses,
            AllocatedRooms: allocationData.allocatedRooms,
            AllocatedTeachers: allocationData.allocatedTeachers,
            RoomDetails: allocationData.roomDetails,
            TeacherAssignments: allocationData.teacherAssignments,
            TotalStudents: allocationData.totalStudents,
            Status: 'allocated',
            Institution: allocationData.institutionId
        });

        const savedAllocation = await allocation.save();

        await Institution.findByIdAndUpdate(
            allocationData.institutionId,
            { $push: { Allocations: savedAllocation._id } }
        );

        await this.updateTeacherDuties(allocationData.teacherAssignments);

        return await Allocation.findById(savedAllocation._id)
            .populate('AllocatedRooms')
            .populate('AllocatedTeachers')
            .populate('RoomDetails.roomId')
            .populate('TeacherAssignments.teacherId')
            .populate('TeacherAssignments.assignedRoom')
            .populate('Institution');
    }

    async updateTeacherDuties(teacherAssignments) {
        for (const assignment of teacherAssignments) {
            await Teacher.findByIdAndUpdate(
                assignment.teacherId,
                { $inc: { RemainingDuty: -1, PracticalDuty: 1 } }
            );
        }
    }

    async getAllocationById(allocationId) {
        return await Allocation.findById(allocationId)
            .populate('AllocatedRooms')
            .populate('AllocatedTeachers')
            .populate('RoomDetails.roomId')
            .populate('TeacherAssignments.teacherId')
            .populate('TeacherAssignments.assignedRoom');
    }

    async getAllAllocations(filters = {}) {
        const query = {};

        if (filters.institutionId) query.Institution = filters.institutionId;
        if (filters.date) query.Date = new Date(filters.date);
        if (filters.shift) query.time = filters.shift;

        return await Allocation.find(query)
            .populate('AllocatedRooms')
            .populate('AllocatedTeachers')
            .populate('Institution')
            .sort({ Date: -1, time: 1 });
    }

    async getInstitutionAllocations(institutionId) {
        return await Allocation.find({ Institution: institutionId })
            .populate('AllocatedRooms')
            .populate('AllocatedTeachers')
            .populate('RoomDetails.roomId')
            .populate('TeacherAssignments.teacherId')
            .populate('TeacherAssignments.assignedRoom')
            .sort({ Date: -1, time: 1 });
    }
}

module.exports = new AllocationService();
