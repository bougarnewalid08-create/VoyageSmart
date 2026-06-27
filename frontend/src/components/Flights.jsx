import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/axios'

const Flights = ({ user, onLogout }) => {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Search parameters
  const [departure, setDeparture] = useState('')
  const [arrival, setArrival] = useState('')
  const [date, setDate] = useState('')

  // Seat selection state
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [showSeatModal, setShowSeatModal] = useState(false)
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [occupiedSeats, setOccupiedSeats] = useState([])
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)

  const getTodayDateString = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const fetchFlights = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/flights')
      setFlights(response.data || [])
    } catch (err) {
      console.error("Error fetching flights:", err)
      setError("Unable to connect to the flight database.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFlights()
  }, [])

  const filteredFlights = flights.filter(flight => {
    if (departure && !flight.departure_city.toLowerCase().includes(departure.toLowerCase()) && !flight.departure_airport.toLowerCase().includes(departure.toLowerCase())) return false
    if (arrival && !flight.arrival_city.toLowerCase().includes(arrival.toLowerCase()) && !flight.arrival_airport.toLowerCase().includes(arrival.toLowerCase())) return false
    
    if (date) {
        // Date format from input is YYYY-MM-DD
        const flightDate = new Date(flight.departure_time).toISOString().split('T')[0]
        if (flightDate !== date) return false
    }

    return true
  })

  const formatTime = (dateString) => {
      return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const formatDuration = (minutes) => {
      const h = Math.floor(minutes / 60)
      const m = minutes % 60
      return `${h}h ${m}m`
  }

  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight)
    setSelectedSeat(null)
    setBookingSuccess(false)
    
    setOccupiedSeats(flight.occupied_seats || [])
    setShowSeatModal(true)
  }

  const handleBookFlight = async () => {
    if (!user) {
      window.location.href = '/login'
      return
    }
    if (!selectedSeat || !selectedFlight) return
    
    setBookingLoading(true)
    try {
      await api.post('/reservations', {
        flight_id: selectedFlight.id,
        seat_number: selectedSeat,
        adults: 1,
        total_amount: selectedSeatInfo.price
      })
      
      // Update local state list so the seat is occupied immediately
      setFlights(prev => prev.map(f => {
        if (f.id === selectedFlight.id) {
          const updatedOccupied = [...(f.occupied_seats || []), selectedSeat]
          return {
            ...f,
            occupied_seats: updatedOccupied,
            available_seats: Math.max(0, f.available_seats - 1)
          }
        }
        return f
      }))
      
      setSelectedFlight(prev => {
        if (prev) {
          return {
            ...prev,
            occupied_seats: [...(prev.occupied_seats || []), selectedSeat],
            available_seats: Math.max(0, prev.available_seats - 1)
          }
        }
        return prev
      })
      
      // Update local occupiedSeats array for immediate seat map visual update
      setOccupiedSeats(prev => [...prev, selectedSeat])
      setBookingSuccess(true)
    } catch (err) {
      console.error("Error booking flight:", err)
      alert(err.response?.data?.message || "Failed to book flight. Please try again.")
    } finally {
      setBookingLoading(false)
    }
  }

  const getSeatClassAndPrice = (seatCode, basePrice) => {
    if (!seatCode) return { cabinClass: '', price: 0 }
    const row = parseInt(seatCode)
    if (row <= 3) {
      return { cabinClass: 'First Class', price: Math.round(basePrice * 7) }
    } else if (row <= 7) {
      return { cabinClass: 'Business Class', price: Math.round(basePrice * 3) }
    } else {
      return { cabinClass: 'Economy Class', price: Math.round(basePrice * 1) }
    }
  }

  const renderSeat = (seatCode, cabinClass) => {
    const isOccupied = occupiedSeats.includes(seatCode)
    const isSelected = selectedSeat === seatCode
    
    let colorClass = ""
    if (isOccupied) {
      colorClass = "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed"
    } else if (isSelected) {
      colorClass = "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100 scale-105"
    } else {
      switch (cabinClass) {
        case 'First':
          colorClass = "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700 hover:border-amber-300"
          break
        case 'Business':
          colorClass = "bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700 hover:border-indigo-300"
          break
        case 'Economy':
        default:
          colorClass = "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700 hover:border-emerald-300"
          break
      }
    }

    return (
      <button
        disabled={isOccupied}
        onClick={() => setSelectedSeat(seatCode)}
        className={`w-7 h-7 rounded-md border text-[9px] font-bold transition-all flex items-center justify-center ${colorClass}`}
      >
        {isOccupied ? (
          <span className="material-symbols-outlined text-[10px]">close</span>
        ) : (
          seatCode.slice(-1)
        )}
      </button>
    )
  }

  const renderSeatMap = () => {
    if (!selectedFlight) return null

    const firstClassRows = [1, 2, 3]
    const businessClassRows = [4, 5, 6, 7]
    const economyClassRows = [8, 9, 10, 11, 12, 13, 14, 15]

    return (
      <div className="space-y-6">
        {/* First Class Section */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-2">
            <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">First Class</span>
            <span className="text-[9px] font-medium text-slate-400">Seat pricing: ${Math.round(selectedFlight.price * 7)}</span>
          </div>
          <div className="space-y-1.5">
            {firstClassRows.map(row => (
              <div key={row} className="grid grid-cols-3 gap-2 items-center justify-items-center">
                {renderSeat(`${row}A`, 'First')}
                <span className="text-[10px] font-black text-slate-300">{row}</span>
                {renderSeat(`${row}B`, 'First')}
              </div>
            ))}
          </div>
        </div>

        {/* Business Class Section */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-2">
            <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">Business Class</span>
            <span className="text-[9px] font-medium text-slate-400">Seat pricing: ${Math.round(selectedFlight.price * 3)}</span>
          </div>
          <div className="space-y-1.5">
            {businessClassRows.map(row => (
              <div key={row} className="grid grid-cols-5 gap-1.5 items-center justify-items-center">
                {renderSeat(`${row}A`, 'Business')}
                {renderSeat(`${row}B`, 'Business')}
                <span className="text-[10px] font-black text-slate-300">{row}</span>
                {renderSeat(`${row}C`, 'Business')}
                {renderSeat(`${row}D`, 'Business')}
              </div>
            ))}
          </div>
        </div>

        {/* Economy Class Section */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-2">
            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Economy Class</span>
            <span className="text-[9px] font-medium text-slate-400">Seat pricing: ${Math.round(selectedFlight.price * 1)}</span>
          </div>
          <div className="space-y-1.5">
            {economyClassRows.map(row => (
              <div key={row} className="grid grid-cols-7 gap-1 items-center justify-items-center">
                {renderSeat(`${row}A`, 'Economy')}
                {renderSeat(`${row}B`, 'Economy')}
                {renderSeat(`${row}C`, 'Economy')}
                <span className="text-[10px] font-black text-slate-300">{row}</span>
                {renderSeat(`${row}D`, 'Economy')}
                {renderSeat(`${row}E`, 'Economy')}
                {renderSeat(`${row}F`, 'Economy')}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const selectedSeatInfo = selectedFlight ? getSeatClassAndPrice(selectedSeat, selectedFlight.price) : { cabinClass: '', price: 0 }

  return (
    <div className="bg-[#f9f9ff] min-h-screen font-['Inter'] relative overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm h-20">
        <nav className="w-full flex items-center px-12 h-full">
          <div className="flex-1 flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-indigo-600">VoyageSmart</Link>
          </div>

          <div className="hidden md:flex flex-none items-center gap-8 font-['Plus_Jakarta_Sans'] text-sm font-medium tracking-tight">
            <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/hotels">Hotels</Link>
            <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/stays">Stays</Link>
            <Link className="text-indigo-600 border-b-2 border-indigo-600 pb-1" to="/flights">Flights</Link>
            <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/plans">Plans</Link>
            <a className="text-gray-500 hover:text-indigo-600 transition-colors" href="#">Smart Planner</a>
            {user && <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/my-reservations">My Bookings</Link>}
          </div>

          <div className="flex-1 flex items-center justify-end gap-4 font-['Plus_Jakarta_Sans'] text-sm font-medium">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-gray-900">Welcome, {user.name}</span>
                  <div className="flex gap-2">
                    {user.role === 'Admin' && <Link to="/dashboard" className="text-[10px] text-indigo-600 font-bold hover:underline">Open Dashboard</Link>}
                    <button onClick={onLogout} className="text-[10px] text-red-500 font-bold hover:underline">Sign Out</button>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {user.name.charAt(0)}
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-5 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-all active:scale-95 duration-200">Log In</Link>
                <Link to="/signup" className="px-5 py-2 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 active:scale-95 duration-200">Sign Up</Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 pt-32">
        <section className="mb-12">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Book Your Next Flight</h1>
          <p className="text-slate-500 font-medium text-lg">Find the best deals and reach your destination in comfort.</p>
        </section>

        {/* Search Widget */}
        <section className="mb-12 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">flight_takeoff</span>
              <input 
                  type="text" 
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  placeholder="Where from?" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 text-sm font-bold outline-none"
              />
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">flight_land</span>
              <input 
                  type="text" 
                  value={arrival}
                  onChange={(e) => setArrival(e.target.value)}
                  placeholder="Where to?" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 text-sm font-bold outline-none"
              />
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">calendar_month</span>
              <input 
                  type="date" 
                  value={date}
                  min={getTodayDateString()}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 text-sm font-bold outline-none text-slate-600"
              />
            </div>
            <button className="bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">search</span>
                Search Flights
            </button>
          </div>
        </section>

        {/* Flight List */}
        <div className="space-y-6">
          {loading ? (
            <div className="p-20 text-center space-y-4">
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Searching the skies...</p>
            </div>
          ) : error ? (
            <div className="p-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
              <span className="material-symbols-outlined text-5xl text-rose-300">cloud_off</span>
              <p className="text-slate-500 font-medium">{error}</p>
              <button onClick={fetchFlights} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 active:scale-95 transition-all">
                Try Again
              </button>
            </div>
          ) : filteredFlights.length === 0 ? (
            <div className="p-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">flight_off</span>
                <p className="text-slate-500 font-bold text-lg mb-2">No flights found</p>
                <p className="text-slate-400 text-sm">Try adjusting your search filters to see more results.</p>
            </div>
          ) : (
            filteredFlights.map((flight) => (
              <motion.div 
                key={flight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group flex flex-col lg:flex-row items-center gap-8"
              >
                {/* Airline Info */}
                <div className="flex flex-col items-center justify-center w-full lg:w-48 shrink-0">
                    <img src={flight.airline_logo} alt={flight.airline} className="h-12 object-contain mb-3" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{flight.airline}</span>
                    <span className="text-xs font-bold text-slate-600 mt-1">{flight.flight_number}</span>
                </div>

                {/* Flight Times */}
                <div className="flex-1 w-full flex items-center justify-between gap-4">
                    <div className="text-center md:text-right flex-1">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">{formatDate(flight.departure_time)}</span>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{formatTime(flight.departure_time)}</h3>
                        <p className="text-sm font-bold text-slate-500 mt-1">{flight.departure_city}</p>
                        <p className="text-xs font-bold text-indigo-400">{flight.departure_airport}</p>
                    </div>

                    <div className="flex flex-col items-center px-4 md:px-8 w-40 shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{formatDuration(flight.duration)}</span>
                        <div className="w-full flex items-center">
                            <div className="w-2 h-2 rounded-full border-2 border-indigo-200"></div>
                            <div className="flex-1 h-[2px] bg-slate-200 relative">
                                <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400 text-[20px] bg-white px-2">flight</span>
                            </div>
                            <div className="w-2 h-2 rounded-full border-2 border-indigo-600 bg-indigo-600"></div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-2">{flight.cabin_class}</span>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">{formatDate(flight.arrival_time)}</span>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{formatTime(flight.arrival_time)}</h3>
                        <p className="text-sm font-bold text-slate-500 mt-1">{flight.arrival_city}</p>
                        <p className="text-xs font-bold text-indigo-400">{flight.arrival_airport}</p>
                    </div>
                </div>

                {/* Price & Action */}
                <div className="w-full lg:w-48 shrink-0 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 pl-0 lg:pl-8 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0">
                    <div className="text-left lg:text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Price per passenger</span>
                        <div className="flex items-baseline gap-1 lg:justify-center">
                            <span className="text-lg font-bold text-slate-400">$</span>
                            <span className="text-4xl font-black text-indigo-600 tracking-tighter">{flight.price}</span>
                        </div>
                        {flight.available_seats < 20 && (
                            <span className="text-[10px] font-bold text-rose-500 mt-2 block bg-rose-50 px-2 py-1 rounded-md text-center">Only {flight.available_seats} seats left</span>
                        )}
                    </div>
                    <button 
                      onClick={() => handleSelectFlight(flight)}
                      className="bg-slate-900 text-white px-8 lg:w-full py-4 rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-95"
                    >
                        Select
                    </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>

      {/* Flight Seat Selector & Booking Modal */}
      <AnimatePresence>
        {showSeatModal && selectedFlight && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowSeatModal(false)
                setSelectedFlight(null)
                setSelectedSeat(null)
                setBookingSuccess(false)
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            {/* Modal Body Container */}
            {!bookingSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 25 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="bg-white rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl border border-slate-100 relative overflow-hidden z-10 flex flex-col max-h-[90vh]"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter">Choose Your Seat</h3>
                    <p className="text-xs text-slate-400 font-bold mt-0.5">{selectedFlight.airline} · {selectedFlight.flight_number}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowSeatModal(false)
                      setSelectedFlight(null)
                      setSelectedSeat(null)
                    }}
                    className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                {/* Seat Map Scrollable Section */}
                <div className="overflow-y-auto py-6 px-1 flex-1 scrollbar-thin">
                  {/* Seating Legend */}
                  <div className="grid grid-cols-4 gap-2 mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[9px] font-bold text-slate-500 text-center">
                    <div className="flex items-center gap-1.5 justify-center">
                      <div className="w-3.5 h-3.5 rounded bg-amber-50 border border-amber-200"></div>
                      <span>First</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-center">
                      <div className="w-3.5 h-3.5 rounded bg-indigo-50 border border-indigo-200"></div>
                      <span>Business</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-center">
                      <div className="w-3.5 h-3.5 rounded bg-emerald-50 border border-emerald-200"></div>
                      <span>Economy</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-center">
                      <div className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300">
                        <span className="material-symbols-outlined text-[8px]">close</span>
                      </div>
                      <span>Occupied</span>
                    </div>
                  </div>

                  {/* Airplane Cabin Structure */}
                  <div className="relative mx-auto max-w-[290px] bg-slate-50/50 rounded-t-[5rem] border-x border-t border-slate-200 pt-12 pb-6 px-4 shadow-inner">
                    {/* Cockpit Indicator */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest block">Cockpit</span>
                      <div className="w-2 h-1 bg-slate-200 rounded-full mx-auto mt-1" />
                    </div>

                    {/* Window decorations on left and right sides */}
                    <div className="absolute -left-1.5 top-20 bottom-10 flex flex-col justify-between gap-6 pointer-events-none">
                      {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="w-1 h-3 rounded-full bg-slate-200" />)}
                    </div>
                    <div className="absolute -right-1.5 top-20 bottom-10 flex flex-col justify-between gap-6 pointer-events-none">
                      {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="w-1 h-3 rounded-full bg-slate-200" />)}
                    </div>

                    {renderSeatMap()}
                  </div>
                </div>

                {/* Footer Pricing Summary & Booking CTA */}
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-4">
                  <div className="flex items-center justify-between px-1">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Seat</p>
                      <p className="text-sm font-black text-slate-800">{selectedSeat ? `Seat ${selectedSeat} (${selectedSeatInfo.cabinClass})` : 'None'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Seat Price</p>
                      <p className="text-xl font-black text-indigo-600">{selectedSeat ? `$${selectedSeatInfo.price}` : '--'}</p>
                    </div>
                  </div>

                  <button
                    disabled={!selectedSeat || bookingLoading}
                    onClick={handleBookFlight}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                    {bookingLoading ? (
                      <>
                        <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Booking...
                      </>
                    ) : (
                      'Confirm & Book Flight'
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Boarding Pass Ticket View */
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 25 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl relative overflow-hidden max-w-md w-full p-8 z-10"
              >
                {/* Boarding pass top header */}
                <div className="flex items-center justify-between pb-6 border-b border-dashed border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-600">airplane_ticket</span>
                    <span className="text-sm font-black text-slate-900 tracking-tighter">VoyageSmart Boarding Pass</span>
                  </div>
                  <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                    {selectedSeatInfo.cabinClass}
                  </span>
                </div>

                {/* Boarding pass airports detail */}
                <div className="flex items-center justify-between my-6">
                  <div>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{selectedFlight.departure_airport}</h4>
                    <p className="text-xs text-slate-400 font-bold mt-0.5">{selectedFlight.departure_city}</p>
                  </div>
                  <div className="flex flex-col items-center flex-1 px-4">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{formatDuration(selectedFlight.duration)}</span>
                    <div className="w-full flex items-center mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                      <div className="flex-1 h-[2px] bg-slate-100 relative">
                        <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 text-[18px] bg-white px-2">flight</span>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{selectedFlight.arrival_airport}</h4>
                    <p className="text-xs text-slate-400 font-bold mt-0.5">{selectedFlight.arrival_city}</p>
                  </div>
                </div>

                {/* Passenger Info Grid */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Passenger</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{user?.name || 'Guest Traveler'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Flight</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedFlight.flight_number}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">
                      {formatDate(selectedFlight.departure_time)} at {formatTime(selectedFlight.departure_time)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Seat</p>
                    <p className="text-xs font-black text-indigo-600 mt-0.5">{selectedSeat}</p>
                  </div>
                </div>

                {/* Price / Payment */}
                <div className="flex items-center justify-between px-2 mb-6">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Price Paid</p>
                    <p className="text-2xl font-black text-slate-900 mt-0.5">${selectedSeatInfo.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Gate</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">B-12</p>
                  </div>
                </div>

                {/* Barcode Mock */}
                <div className="flex flex-col items-center pt-6 border-t border-slate-100">
                  <div className="h-10 w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#1e293b_2px,#1e293b_4px,transparent_4px,transparent_6px,#1e293b_6px,#1e293b_9px)]" />
                  <span className="text-[9px] font-mono text-slate-400 mt-2 tracking-[0.3em]">VS-{selectedFlight.id}-{selectedSeat}</span>
                </div>

                {/* Close Ticket Button */}
                <button
                  onClick={() => {
                    setShowSeatModal(false)
                    setSelectedFlight(null)
                    setSelectedSeat(null)
                    setBookingSuccess(false)
                  }}
                  className="mt-6 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all active:scale-98"
                >
                  Close Ticket
                </button>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Flights
