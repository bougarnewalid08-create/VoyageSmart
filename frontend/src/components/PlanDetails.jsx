import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import api, { BACKEND_URL } from '../api/axios'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const PlanDetails = ({ user, onLogout }) => {
  const { id } = useParams()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeDay, setActiveDay] = useState(1)

  const [checkIn, setCheckIn] = useState(new Date())
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [isGuestOpen, setIsGuestOpen] = useState(false)
  const [booking, setBooking] = useState(false)
  const [bookingStatus, setBookingStatus] = useState(null) 
  const [bookingMessage, setBookingMessage] = useState('')

  const fetchPlanDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get(`/plans/${id}`)
      setPlan(response.data)
      if (response.data && response.data.activities && response.data.activities.length > 0) {
        setActiveDay(response.data.activities[0].day)
      }
    } catch (err) {
      console.error("Error fetching plan details:", err)
      setError("We were unable to retrieve this itinerary. It might not exist anymore.")
    } finally {
      setLoading(false)
    }
  }

  const handleBookPlan = async () => {
    if (!user) {
      setBookingStatus('login')
      setBookingMessage('Please log in to book this journey.')
      return
    }

    setBooking(true)
    setBookingStatus(null)

    try {
      const formatDateForAPI = (date) => date.toISOString().split('T')[0]
      const res = await api.post('/reservations', {
        plan_id: plan.id,
        check_in: formatDateForAPI(checkIn),
        adults,
        children,
        total_amount: price,
      })

      setBookingStatus('success')
      setBookingMessage(`Your journey has been booked successfully!`)
    } catch (err) {
      console.error(err)
      if (err.response?.status === 409) {
        setBookingStatus('conflict')
      } else {
        setBookingStatus('error')
      }
      setBookingMessage(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchPlanDetails()
    }
  }, [id])

  const renderActivity = (activity, index) => {
    if (activity.type === 'hotel') {
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex gap-6 relative group"
        >
          <div className="z-10 flex-none w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:border-indigo-600 transition-colors">
            <span className="material-symbols-outlined text-indigo-600 text-[20px]">hotel</span>
          </div>
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-50 flex-grow overflow-hidden hover:shadow-md transition-all">
            <div className="grid grid-cols-1 md:grid-cols-5 h-full">
              <div className="md:col-span-2 relative min-h-[140px]">
                <img className="h-full w-full object-cover" src={activity.hotel_image || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop"} alt={activity.hotel_name} />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl shadow-sm text-indigo-600 font-black text-[9px] uppercase tracking-widest">Recommended Stay</div>
              </div>
              <div className="md:col-span-3 p-6 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">{activity.hotel_name}</h3>
                  {activity.hotel_stars && (
                    <div className="flex text-amber-400 flex-none">
                      {Array.from({ length: activity.hotel_stars }).map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-slate-500 text-sm font-medium italic mb-4">"{activity.description}"</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xl font-black text-slate-900">${activity.hotel_price}<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">/night</span></span>
                  <Link to={activity.hotel_db_id ? `/hotel-details/${activity.hotel_db_id}` : (activity.stay_db_id ? `/stay-details/db-${activity.stay_db_id}` : '/hotels')}>
                    <button className="bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all active:scale-95">View Stays</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )
    }

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex gap-6 relative group"
      >
        <div className="z-10 flex-none w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:border-indigo-600 transition-colors">
          <span className="material-symbols-outlined text-indigo-600 text-[20px]">{activity.type || 'explore'}</span>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50 flex-grow hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-indigo-400 font-black text-[9px] uppercase tracking-[0.2em] mb-2 block">{activity.time}</span>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">{activity.title}</h3>
            </div>
            {activity.type === 'restaurant' && (
              <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Smart Suggestion</span>
            )}
          </div>
          <p className="text-slate-500 leading-relaxed text-sm font-medium mb-6">{activity.description}</p>

          {activity.images && activity.images.length > 0 && (
            <div className={`grid gap-3 ${activity.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {activity.images.map((img, idx) => (
                <img key={idx} className="rounded-[1.5rem] h-36 w-full object-cover animate-fade-in" src={img} alt={`Activity preview ${idx + 1}`} />
              ))}
            </div>
          )}

          {activity.meta && (
            <div className="flex items-center gap-2 text-slate-400 mt-6 pt-6 border-t border-slate-50">
              <span className="material-symbols-outlined text-[14px]">info</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{activity.meta}</span>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  const activeDayData = plan?.activities?.find(d => d.day === activeDay)
  const dayActivities = activeDayData ? activeDayData.activities : []

  const weatherCity = plan?.stops && plan.stops.length > 0 ? plan.stops[plan.stops.length - 1] : 'Destination'
  const isColdTheme = plan?.theme === 'Adventure' || plan?.title.toLowerCase().includes('nordic') || plan?.title.toLowerCase().includes('winter')
  const temp = isColdTheme ? '-2°C' : '24°C'
  const weatherIcon = isColdTheme ? 'ac_unit' : 'sunny'
  const weatherDesc = isColdTheme ? 'Perfect for Aurora Borealis' : 'Perfect for walking tours'

  const calculateDynamicHotelCost = () => {
    if (!plan || !plan.activities) return 0;
    let totalHotelCost = 0;

    const durationMatch = plan.duration ? plan.duration.match(/\d+/) : null;
    const totalNights = durationMatch ? parseInt(durationMatch[0]) : 1;

    const hotelStays = [];
    plan.activities.forEach(dayData => {
      const day = dayData.day || 1;
      const hotelAct = dayData.activities?.find(act => act.type === 'hotel');
      if (hotelAct) {
        hotelStays.push({
          day,
          price: parseFloat(hotelAct.hotel_price) || 150
        });
      }
    });

    hotelStays.sort((a, b) => a.day - b.day);

    for (let i = 0; i < hotelStays.length; i++) {
      const currentStay = hotelStays[i];
      const checkInDay = currentStay.day;

      let checkOutDay = totalNights + 1;
      if (i + 1 < hotelStays.length) {
        checkOutDay = hotelStays[i + 1].day;
      }

      const nights = Math.max(1, checkOutDay - checkInDay);
      const subPrice = currentStay.price;
      const subServiceFee = nights * 5;
      const subTotal = (subPrice * nights) + subServiceFee;
      totalHotelCost += subTotal;
    }

    return totalHotelCost;
  };

  const hotelBudget = calculateDynamicHotelCost()
  const flightBudget = plan?.flight ? parseFloat(plan.flight.price) : 250
  const gasExpense = plan?.gas_expense || 0
  const transportBudget = flightBudget + gasExpense
  const foodExpense = plan?.food_expense || 0
  const serviceFee = 25.00
  const price = hotelBudget + transportBudget + foodExpense + serviceFee

  return (
    <div className="bg-[#f9f9ff] min-h-screen font-['Inter'] antialiased selection:bg-indigo-100 selection:text-indigo-900">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .react-datepicker-wrapper { width: 100%; }
        .react-datepicker__input-container input { 
          background: transparent; 
          border: none; 
          padding: 0; 
          color: #0f172a; 
          font-weight: 700; 
          font-size: 0.875rem; 
          width: 100%; 
          outline: none;
        }
        .react-datepicker-popper {
          z-index: 100 !important;
        }
        .react-datepicker {
          border: 1px solid #f1f5f9 !important;
          border-radius: 1.5rem !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05) !important;
          font-family: 'Inter', sans-serif !important;
          overflow: hidden;
        }
        .react-datepicker__header {
          background-color: white !important;
          border-bottom: 1px solid #f1f5f9 !important;
          padding-top: 1rem !important;
        }
        .react-datepicker__navigation {
          top: 1rem !important;
        }
        .react-datepicker__current-month {
          font-weight: 800 !important;
          color: #0f172a !important;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.75rem !important;
        }
        .react-datepicker__day--selected {
          background-color: #4f46e5 !important;
          border-radius: 50%;
        }
      `}</style>

      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm fixed top-0 z-50 w-full h-20">
        <nav className="flex items-center justify-between w-full max-w-[1536px] mx-auto px-12 h-full">
          <div className="flex-1 flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-indigo-600">VoyageSmart</Link>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-['Plus_Jakarta_Sans'] text-sm font-medium">
            <Link className="text-slate-500 hover:text-indigo-600 transition-all" to="/hotels">Hotels</Link>
            <Link className="text-slate-500 hover:text-indigo-600 transition-all" to="/stays">Stays</Link>
            <Link className="text-slate-500 hover:text-indigo-600 transition-all" to="/flights">Flights</Link>
            <Link className="text-indigo-600 border-b-2 border-indigo-600 pb-1" to="/plans">Plans</Link>
            <a className="text-slate-500 hover:text-indigo-600 transition-all" href="#">Smart Planner</a>
            {user && <Link className="text-slate-500 hover:text-indigo-600 transition-all" to="/my-reservations">My Bookings</Link>}
          </nav>

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
                <Link to="/signup" className="px-5 py-2 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 active:scale-95 duration-200 text-sm font-bold">Sign Up</Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="pt-32 pb-32 px-6 max-w-6xl mx-auto">
        {loading ? (
          <div className="py-32 text-center space-y-4">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Assembling your itinerary route...</p>
          </div>
        ) : error ? (
          <div className="py-24 text-center bg-white rounded-[3.5rem] border border-slate-100 shadow-xl max-w-xl mx-auto p-12 space-y-6">
            <span className="material-symbols-outlined text-6xl text-rose-400">explore_off</span>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Oops!</h2>
            <p className="text-slate-500 font-medium">{error}</p>
            <div className="pt-4">
              <Link to="/plans" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">
                Back to Curated Plans
              </Link>
            </div>
          </div>
        ) : (
          <>
            <section className="mb-16">
              <div className="relative h-[350px] w-full rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white">
                <img className="w-full h-full object-cover" src={plan.image ? (plan.image.startsWith('http') ? plan.image : `${BACKEND_URL}${plan.image}`) : 'https://via.placeholder.com/1200x400'} alt={plan.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-indigo-600 text-white text-[9px] px-3 py-1 rounded-full uppercase tracking-[0.2em] font-black shadow-lg">Curated Route</span>
                    <span className="bg-white/20 backdrop-blur-md text-white text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-[0.2em] border border-white/30">{plan.duration}</span>
                    <span className="bg-white/20 backdrop-blur-md text-white text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-[0.2em] border border-white/30">{plan.theme}</span>
                  </div>
                  <h1 className="text-white text-5xl font-black tracking-tighter mb-4">{plan.title}</h1>
                  <div className="flex items-center gap-5 text-white/90 font-bold text-[11px] uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-indigo-400">map</span>
                      Stops: {Array.isArray(plan.stops) ? plan.stops.join(" → ") : ""}
                    </span>
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-indigo-400">payments</span> {plan.budget_level} Budget</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-12">
                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                  {plan.activities && plan.activities.map((dayData) => (
                    <button
                      key={dayData.day}
                      onClick={() => setActiveDay(dayData.day)}
                      className={`flex-none px-6 py-2.5 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all ${activeDay === dayData.day ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
                    >
                      Day {dayData.day}
                    </button>
                  ))}
                </div>

                <div className="space-y-10 relative">
                  {dayActivities.length > 1 && (
                    <div className="absolute left-[23px] top-6 bottom-6 w-[1.5px] bg-slate-100"></div>
                  )}

                  {dayActivities.length > 0 ? (
                    dayActivities.map((activity, idx) => renderActivity(activity, idx))
                  ) : (
                    <div className="bg-white p-12 rounded-[2rem] shadow-sm text-center text-slate-400 border border-slate-50">
                      <span className="material-symbols-outlined text-4xl mb-2">hotel_class</span>
                      <p className="font-bold text-xs uppercase tracking-widest">Leisure & Relax day - No scheduled activities</p>
                    </div>
                  )}
                </div>
              </div>

              <aside className="lg:col-span-4 space-y-10">
                <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <h4 className="font-black uppercase text-[10px] tracking-[0.3em] opacity-60 mb-4">{weatherCity} Weather</h4>
                    <div className="flex items-center gap-6">
                      <span className="material-symbols-outlined text-6xl group-hover:scale-110 transition-transform duration-500">{weatherIcon}</span>
                      <div>
                        <span className="text-5xl font-black tracking-tighter">{temp}</span>
                        <p className="font-bold text-sm opacity-90 mt-1">{weatherDesc}</p>
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[180px] text-white/10 group-hover:rotate-12 transition-transform duration-1000">cloud</span>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-50 p-10 sticky top-32">
                  <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Budget Breakdown</h3>
                  <div className="space-y-8">
                    {[
                      { label: 'Hotel / Stay', amount: hotelBudget, color: 'bg-indigo-600', icon: 'hotel' },
                      { label: 'Flight & Gas', amount: transportBudget, color: 'bg-emerald-500', icon: 'directions_car', subtext: `Incl. $${gasExpense} gas & $${flightBudget} flight` },
                      { label: 'Food Allowance', amount: foodExpense, color: 'bg-rose-500', icon: 'restaurant' },
                      { label: 'Service & Booking Fee', amount: serviceFee, color: 'bg-amber-500', icon: 'payments' }
                    ].map((item) => (
                      <div key={item.label} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-3 text-slate-500 font-bold text-sm uppercase tracking-widest">
                            <span className={`material-symbols-outlined ${item.color.replace('bg-', 'text-')} text-sm`}>{item.icon}</span>
                            {item.label}
                          </span>
                          <span className="font-black text-slate-900">${item.amount}</span>
                        </div>
                        {item.subtext && (
                          <div className="text-[10px] text-slate-400 font-bold -mt-2">{item.subtext}</div>
                        )}
                        <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${Math.round((item.amount / price) * 100)}%` }}
                            viewport={{ once: true }}
                            className={`h-full ${item.color} rounded-full`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                    <div className="bg-slate-50 rounded-[1.5rem] border border-slate-100 p-5">
                      <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Start Date</label>
                      <DatePicker
                        selected={checkIn}
                        onChange={(date) => setCheckIn(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Start Date"
                        minDate={new Date()}
                        showOutsideDays={false}
                        popperPlacement="bottom-start"
                      />
                    </div>

                    <div className="relative">
                      <div
                        onClick={() => setIsGuestOpen(!isGuestOpen)}
                        className="bg-slate-50 rounded-[1.5rem] border border-slate-100 p-5 relative cursor-pointer hover:bg-slate-100/50 transition-colors group"
                      >
                        <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Travelers</label>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-900 font-bold text-sm">
                            {adults} Adult{adults > 1 ? 's' : ''}{children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}
                          </span>
                          <span className={`material-symbols-outlined text-slate-400 group-hover:text-indigo-600 transition-transform ${isGuestOpen ? 'rotate-180' : ''}`}>expand_more</span>
                        </div>
                      </div>

                      {isGuestOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 z-[110] space-y-6"
                        >
                          <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest pb-3 border-b border-slate-50 flex justify-between items-center">
                            <span>Guest Capacity</span>
                            <span className="text-indigo-600">Max {plan?.max_travelers || 4} Guests</span>
                          </div>

$*                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-slate-900 text-sm">Adults</p>
                              <p className="text-[10px] text-slate-400 font-medium">Age 13+</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => setAdults(Math.max(1, adults - 1))}
                                className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-90"
                              >
                                <span className="material-symbols-outlined text-lg">remove</span>
                              </button>
                              <span className="text-sm font-bold text-slate-900 w-4 text-center">{adults}</span>
                              <button
                                onClick={() => {
                                  if (adults + children < (plan?.max_travelers || 4)) setAdults(adults + 1)
                                }}
                                disabled={adults + children >= (plan?.max_travelers || 4)}
                                className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <span className="material-symbols-outlined text-lg">add</span>
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-slate-900 text-sm">Children</p>
                              <p className="text-[10px] text-slate-400 font-medium">Ages 2-12</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => setChildren(Math.max(0, children - 1))}
                                className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-90"
                              >
                                <span className="material-symbols-outlined text-lg">remove</span>
                              </button>
                              <span className="text-sm font-bold text-slate-900 w-4 text-center">{children}</span>
                              <button
                                onClick={() => {
                                  if (adults + children < (plan?.max_travelers || 4)) setChildren(children + 1)
                                }}
                                disabled={adults + children >= (plan?.max_travelers || 4)}
                                className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <span className="material-symbols-outlined text-lg">add</span>
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={() => setIsGuestOpen(false)}
                            className="w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                          >
                            Done
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="mt-12 pt-12 border-t border-slate-50">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Estimated Total</span>
                      <span className="text-4xl font-black text-slate-900 tracking-tighter">${Math.round(price)}</span>
                    </div>

                    {bookingStatus && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-5 mb-5 rounded-2xl text-sm font-bold flex items-center gap-3 ${bookingStatus === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            bookingStatus === 'conflict' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                              bookingStatus === 'login' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}
                      >
                        <span className="material-symbols-outlined text-lg">
                          {bookingStatus === 'success' ? 'check_circle' :
                            bookingStatus === 'conflict' ? 'warning' :
                              bookingStatus === 'login' ? 'lock' : 'error'}
                        </span>
                        <span className="flex-1">{bookingMessage}</span>
                        {bookingStatus === 'login' && (
                          <Link to="/login" className="ml-2 underline font-black">Log In</Link>
                        )}
                      </motion.div>
                    )}

                    <div className="space-y-4">
                      {bookingStatus === 'success' ? (
                        <div className="w-full bg-emerald-500 py-6 text-white rounded-[2rem] font-bold text-sm text-center shadow-xl shadow-emerald-100 flex items-center justify-center gap-3">
                          <span className="material-symbols-outlined">check_circle</span>
                          Journey Booked!
                        </div>
                      ) : (
                        <button
                          onClick={handleBookPlan}
                          disabled={booking}
                          className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-bold text-sm flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 active:scale-[0.97] transition-all hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {booking ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Securing Booking...
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined">shopping_cart_checkout</span>
                              Book Full Journey
                            </>
                          )}
                        </button>
                      )}
                      <button className="w-full bg-white text-indigo-600 border-2 border-slate-100 py-6 rounded-[2rem] font-bold text-sm flex items-center justify-center gap-3 hover:border-indigo-600 transition-all">
                        <span className="material-symbols-outlined">share</span>
                        Share Itinerary
                      </button>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 py-24 mt-20">
        <div className="max-w-[1536px] mx-auto px-12 text-center">
          <span className="text-3xl font-black text-indigo-600 mb-8 block tracking-tighter">VoyageSmart</span>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] max-w-lg mx-auto leading-relaxed mb-12">Effortless Discovery. Tailoring Journeys for the Modern Explorer.</p>
          <div className="flex justify-center gap-12 border-t border-slate-50 pt-12">
            {['Privacy', 'Terms', 'Support', 'Guide'].map(link => (
              <a key={link} className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-indigo-600 transition-colors" href="#">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PlanDetails
