import React, { useEffect, useState } from 'react';
import { Building, MapPin, Users, CheckCircle, XCircle, Search, Filter, Home, BookOpen } from 'lucide-react';
import { getRooms } from '../operations/services/Allocation';
import { useSelector } from 'react-redux';



const RoomDisplay = () => {
  const {token} = useSelector(state=>state.Auth);
  
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, available, unavailable
  const [filterType, setFilterType] = useState('all'); // all, lecture hall, lab, etc.
  const [filterFloor, setFilterFloor] = useState('all'); // all, 1, 2, 3, 4

  useEffect(() => {
    const getRoomsData = async () => {
      try {
        setLoading(true);
        const response = await getRooms(token);
        
        setRooms(response);
      } catch (err) {
        setError('Failed to fetch rooms data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getRoomsData();
  }, []);

  // Get unique room types and floors for filters
  const roomTypes = [...new Set(rooms.map(room => room.RoomType))];
  const floors = [...new Set(rooms.map(room => room.floor))].sort();

  // Filter and search rooms
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.RoomNo.toString().includes(searchTerm) ||
                         room.RoomType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'available' && room.IsAvailable) ||
                         (filterStatus === 'unavailable' && !room.IsAvailable);
    
    const matchesType = filterType === 'all' || room.RoomType === filterType;
    
    const matchesFloor = filterFloor === 'all' || room.floor.toString() === filterFloor;
    
    return matchesSearch && matchesStatus && matchesType && matchesFloor;
  });

  // Calculate statistics
  const stats = {
    total: rooms.length,
    available: rooms.filter(r => r.IsAvailable).length,
    unavailable: rooms.filter(r => !r.IsAvailable).length,
    totalCapacity: rooms.reduce((sum, r) => sum + r.Capacity, 0),
    avgCapacity: Math.round(rooms.reduce((sum, r) => sum + r.Capacity, 0) / rooms.length) || 0
  };

  // Get room type icon
  const getRoomTypeIcon = (roomType) => {
    switch (roomType.toLowerCase()) {
      case 'lecture hall':
      case 'seminar hall':
        return <BookOpen className="w-5 h-5" />;
      case 'computer lab':
      case 'laboratory':
        return <Building className="w-5 h-5" />;
      case 'auditorium':
        return <Users className="w-5 h-5" />;
      default:
        return <Home className="w-5 h-5" />;
    }
  };

  // Get capacity color coding
  const getCapacityColor = (capacity) => {
    if (capacity >= 100) return 'text-purple-600 bg-purple-100';
    if (capacity >= 50) return 'text-blue-600 bg-blue-100';
    if (capacity >= 30) return 'text-green-600 bg-green-100';
    return 'text-orange-600 bg-orange-100';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <XCircle className="w-16 h-16 mx-auto mb-4" />
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen overflow-scroll bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Room Management</h1>
          <p className="text-gray-600">Manage and view room availability and details</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Rooms</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Available</p>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Unavailable</p>
                <p className="text-2xl font-bold text-red-600">{stats.unavailable}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Capacity</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalCapacity}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Avg Capacity</p>
                <p className="text-2xl font-bold text-orange-600">{stats.avgCapacity}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search room number or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              {roomTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Floors</option>
              {floors.map(floor => (
                <option key={floor} value={floor}>Floor {floor}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <div key={room._id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full mr-3 ${getCapacityColor(room.Capacity)}`}>
                      {getRoomTypeIcon(room.RoomType)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Room {room.RoomNo}</h3>
                      <p className="text-sm text-gray-600">{room.RoomType}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    room.IsAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {room.IsAvailable ? 'Available' : 'Occupied'}
                  </div>
                </div>

                {/* Room Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Floor {room.floor}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-800">{room.Capacity} seats</span>
                    </div>
                  </div>
                  
                  {/* Capacity Indicator */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        room.Capacity >= 100 ? 'bg-purple-500' :
                        room.Capacity >= 50 ? 'bg-blue-500' :
                        room.Capacity >= 30 ? 'bg-green-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${Math.min((room.Capacity / 200) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Capacity Scale</span>
                    <span>{room.Capacity <= 30 ? 'Small' : room.Capacity <= 50 ? 'Medium' : room.Capacity <= 100 ? 'Large' : 'Extra Large'}</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">{room.floor}</p>
                    <p className="text-xs text-gray-600">Floor Level</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-lg font-bold text-purple-600">{room.Capacity}</p>
                    <p className="text-xs text-gray-600">Max Capacity</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room Type:</span>
                    <span className="font-medium">{room.RoomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room ID:</span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {room._id.slice(-8)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Status: {room.IsAvailable ? 'Ready for use' : 'Currently occupied'}
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Manage
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">No rooms found</p>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDisplay;