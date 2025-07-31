const Allocation = require('../models/Allocation');
const allocationService = require('../services/allocation');

exports.createAllocation=async(req, res)=> {
    try {
        const {id:institutionId}=req.user;
        const { date, shift, courses } = req.body;
        console.log(courses,shift)

        const result = await allocationService.allocateRoomsAndTeachers({
            date,
            shift,
            courses,
            institutionId
        });

        if (result.success) {
            res.status(201).json({
                success: true,
                message: result.message,
                data: result.allocation
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};


exports.getAllocation=async(req, res)=>{
    try {
        const { id } = req.body;
        const allocation = await allocationService.getAllocationById(id);

        if (!allocation) {
            return res.status(404).json({
                success: false,
                message: 'Allocation not found'
            });
        }

        res.json({
            success: true,
            data: allocation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};


exports.getAllAllocations=async(req, res)=>{
    try {
        const {id:institutionId}=req.user;
        const { date} = req.body;
        const newDate=new Date(date) ;
        console.log(Date);
        const allocations=await Allocation.find({Date:newDate, Institution:institutionId})

        // const allocations = await allocationService.getAllAllocations(filters);

        res.json({
            success: true,
            data: allocations,
            count: allocations.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

exports.getInstitutionAllocations=async(req, res)=>{
    try {
        const { id:institutionId } = req.user;

        const allocations = await allocationService.getInstitutionAllocations(institutionId);

        return res.json({
            success: true,
            data: allocations,
            count: allocations.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};