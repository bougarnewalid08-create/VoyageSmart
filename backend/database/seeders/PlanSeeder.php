<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Plan;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'title' => 'The Grecian Odyssey',
                'duration' => '10 Days',
                'stops' => ['Athens', 'Mykonos', 'Santorini'],
                'price' => 2400.00,
                'image' => 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2000&auto=format&fit=crop',
                'theme' => 'Cultural',
                'budget_level' => 'Premium',
                'max_travelers' => 6,
                'activities' => [
                    [
                        'day' => 1,
                        'activities' => [
                            [
                                'time' => '11:00 AM',
                                'type' => 'flight_land',
                                'title' => 'Arrival at Athens International Airport',
                                'description' => 'Upon arrival, your private chauffeur will meet you at the arrivals hall and transfer you directly to your hotel in Plaka.',
                                'meta' => 'Driver contact: +30 210 123 4567'
                            ],
                            [
                                'time' => '07:30 PM',
                                'type' => 'restaurant',
                                'title' => 'Traditional Greek Dinner in Plaka',
                                'description' => 'Enjoy an authentic dinner featuring fresh souvlaki, moussaka, and local wine at a tavern nestled beneath the lit-up Acropolis.',
                                'images' => [
                                    'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=1000&auto=format&fit=crop'
                                ]
                            ]
                        ]
                    ],
                    [
                        'day' => 2,
                        'activities' => [
                            [
                                'time' => '09:00 AM',
                                'type' => 'explore',
                                'title' => 'Acropolis & Parthenon Guided Tour',
                                'description' => 'A private archeologist guide will lead you through the monumental Propylaea, the Temple of Athena Nike, and the iconic Parthenon.',
                                'meta' => 'Skip-the-line ticket included'
                            ],
                            [
                                'time' => '03:00 PM',
                                'type' => 'explore',
                                'title' => 'Walk through Anafiotika',
                                'description' => 'Stroll through the scenic, island-like neighborhood of Anafiotika, built by craftsmen from Anafi with white-washed houses and narrow alleys.',
                            ]
                        ]
                    ],
                    [
                        'day' => 3,
                        'activities' => [
                            [
                                'time' => '08:00 AM',
                                'type' => 'boat',
                                'title' => 'High-Speed Ferry to Mykonos',
                                'description' => 'Board the SeaJets ferry at Piraeus Port for a scenic cruise across the Aegean Sea to Mykonos Island.',
                                'meta' => 'Ferry departs at 08:30 AM (Business Class seat)'
                            ],
                            [
                                'time' => '06:00 PM',
                                'type' => 'explore',
                                'title' => 'Sunset Drinks at Little Venice',
                                'description' => 'Sit by the water\'s edge in Little Venice as waves crash below, enjoying cocktails with a direct view of the famous Mykonos Windmills.',
                            ]
                        ]
                    ],
                    [
                        'day' => 4,
                        'activities' => [
                            [
                                'time' => '10:00 AM',
                                'type' => 'spa',
                                'title' => 'Beach Day at Psarou Beach',
                                'description' => 'Relax under luxury sunbeds at the famous Psarou Beach, enjoying turquoise waters, chilled music, and premium hospitality.',
                            ],
                            [
                                'time' => '08:30 PM',
                                'type' => 'restaurant',
                                'title' => 'Dinner at Interni Restaurant',
                                'description' => 'Dine in one of the most beautiful open-air courtyard garden settings in Mykonos town, combining high-end gastronomy with a chic atmosphere.',
                            ]
                        ]
                    ],
                    [
                        'day' => 5,
                        'activities' => [
                            [
                                'time' => '11:30 AM',
                                'type' => 'boat',
                                'title' => 'Ferry to Santorini Island',
                                'description' => 'Take the mid-day ferry to the volcanic caldera island of Santorini. Climb the cliffside road with a private shuttle to Oia.',
                            ],
                            [
                                'time' => '07:00 PM',
                                'type' => 'restaurant',
                                'title' => 'Dinner overlooking the Caldera',
                                'description' => 'A clifftop candlelit table awaits you in Oia to watch the world-famous sunset paint the whitewashed cave-houses in shades of gold and violet.',
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Nordic Winter Escape',
                'duration' => '7 Days',
                'stops' => ['Oslo', 'Tromsø', 'Lofoten'],
                'price' => 3100.00,
                'image' => 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?q=80&w=2000&auto=format&fit=crop',
                'theme' => 'Adventure',
                'budget_level' => 'Luxe',
                'max_travelers' => 4,
                'activities' => [
                    [
                        'day' => 1,
                        'activities' => [
                            [
                                'time' => '02:00 PM',
                                'type' => 'flight_land',
                                'title' => 'Arrival at Oslo Gardermoen',
                                'description' => 'Welcome to Norway. Check in to your design hotel in the new Bjørvika district near the iconic Opera House.',
                            ],
                            [
                                'time' => '07:30 PM',
                                'type' => 'restaurant',
                                'title' => 'Nordic Gastronomy Dinner',
                                'description' => 'Indulge in a premium New Nordic cuisine tasting menu at a Michelin-rated local restaurant.',
                            ]
                        ]
                    ],
                    [
                        'day' => 2,
                        'activities' => [
                            [
                                'time' => '10:00 AM',
                                'type' => 'explore',
                                'title' => 'Oslo Fjord Floating Sauna',
                                'description' => 'Experience the traditional Oslo fjord sauna culture: heat up in a wood-fired sauna before plunging directly into the icy waters.',
                                'meta' => 'Towels and private locker included'
                            ],
                            [
                                'time' => '04:00 PM',
                                'type' => 'flight_land',
                                'title' => 'Flight to Tromsø (Arctic Circle)',
                                'description' => 'Fly north to Tromsø, the Gateway to the Arctic, surrounded by dramatic snowcapped peaks and deep fjords.',
                            ]
                        ]
                    ],
                    [
                        'day' => 3,
                        'activities' => [
                            [
                                'time' => '10:00 AM',
                                'type' => 'explore',
                                'title' => 'Husky Dog-Sledding Safari',
                                'description' => 'Command your own team of eager Alaskan Huskies through silent, snow-covered valleys with a professional musher guiding the way.',
                                'images' => [
                                    'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop'
                                ]
                            ],
                            [
                                'time' => '08:00 PM',
                                'type' => 'explore',
                                'title' => 'Northern Lights Chase Cruise',
                                'description' => 'Sail out into the absolute darkness of the outer fjords on a hybrid-electric boat to witness the green Aurora Borealis dancing across the sky.',
                                'meta' => 'Hot chocolate and warm thermal suits provided'
                            ]
                        ]
                    ],
                    [
                        'day' => 4,
                        'activities' => [
                            [
                                'time' => '09:00 AM',
                                'type' => 'directions_car',
                                'title' => 'Scenic Drive to Lofoten Islands',
                                'description' => 'Drive through bridges and submarine tunnels, capturing views of fishing villages, rocky shorelines, and towering mountains.',
                            ],
                            [
                                'time' => '04:00 PM',
                                'type' => 'hotel',
                                'title' => 'Check-in to a Luxury Rorbu Cabin',
                                'description' => 'Stay in a beautifully restored traditional red fishermen\'s cabin built on stilts directly over the Arctic waters of Reine.',
                                'hotel_name' => 'Eliassen Rorbuer',
                                'hotel_price' => 380,
                                'hotel_stars' => 4,
                                'hotel_image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop'
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Tokyo to Kyoto Express',
                'duration' => '8 Days',
                'stops' => ['Tokyo', 'Hakone', 'Kyoto'],
                'price' => 2800.00,
                'image' => 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop',
                'theme' => 'Cultural',
                'budget_level' => 'Premium',
                'max_travelers' => 5,
                'activities' => [
                    [
                        'day' => 1,
                        'activities' => [
                            [
                                'time' => '03:00 PM',
                                'type' => 'flight_land',
                                'title' => 'Welcome to Tokyo (Haneda Airport)',
                                'description' => 'After customs, board your private shuttle straight to your hotel in the bustling high-rise heart of Shinjuku.',
                            ],
                            [
                                'time' => '07:30 PM',
                                'type' => 'restaurant',
                                'title' => 'Sake & Yakitori Tasting in Memory Lane',
                                'description' => 'Navigate the retro alleyways of Omoide Yokocho for an authentic introduction to Tokyo\'s street food and craft beers.',
                            ]
                        ]
                    ],
                    [
                        'day' => 2,
                        'activities' => [
                            [
                                'time' => '09:00 AM',
                                'type' => 'explore',
                                'title' => 'Senso-ji Temple & Asakusa Walking Tour',
                                'description' => 'Step back in time at Tokyo\'s oldest Buddhist temple, shopping for traditional snacks along Nakamise Street.',
                            ],
                            [
                                'time' => '02:00 PM',
                                'type' => 'explore',
                                'title' => 'teamLab Planets Digital Art Exhibition',
                                'description' => 'Immerse yourself in infinite crystal universes and floating orchid gardens at this world-famous digital museum.',
                            ]
                        ]
                    ],
                    [
                        'day' => 3,
                        'activities' => [
                            [
                                'time' => '08:30 AM',
                                'type' => 'directions_car',
                                'title' => 'Bullet Train to Hakone & Mt. Fuji Cruise',
                                'description' => 'Board the Shinkansen to the mountainous hot-spring resort of Hakone. Sail in a pirate ship across Lake Ashi for iconic views of Mt. Fuji.',
                                'meta' => 'Hakone Free Pass included'
                            ],
                            [
                                'time' => '05:00 PM',
                                'type' => 'hotel',
                                'title' => 'Hakone Ryokan Stay & Kaiseki Dinner',
                                'description' => 'Put on a yukata robe, enjoy a private hot-spring bath (onsen), and feast on a multi-course Kaiseki dinner.',
                                'hotel_name' => 'Hakone Ginyu Ryokan',
                                'hotel_price' => 600,
                                'hotel_stars' => 5,
                                'hotel_image' => 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop'
                            ]
                        ]
                    ],
                    [
                        'day' => 4,
                        'activities' => [
                            [
                                'time' => '10:00 AM',
                                'type' => 'directions_car',
                                'title' => 'Bullet Train to Imperial Kyoto',
                                'description' => 'Take the Shinkansen south to Kyoto. Wander through the historical Gion district to spot geishas returning to their teahouses.',
                            ],
                            [
                                'time' => '06:00 PM',
                                'type' => 'explore',
                                'title' => 'Fushimi Inari Shrine Sunset Hike',
                                'description' => 'Hike through the breathtaking tunnels of 10,000 bright red Torii gates as the sun sets over Kyoto.',
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Amalfi Coast Dream',
                'duration' => '6 Days',
                'stops' => ['Naples', 'Positano', 'Amalfi'],
                'price' => 3500.00,
                'image' => 'https://images.unsplash.com/photo-1633321088355-d0f81134ca3b?q=80&w=2000&auto=format&fit=crop',
                'theme' => 'Romantic',
                'budget_level' => 'Luxe',
                'max_travelers' => 2,
                'activities' => [
                    [
                        'day' => 1,
                        'activities' => [
                            [
                                'time' => '09:30 AM',
                                'type' => 'flight_land',
                                'title' => 'Arrival at Naples Airport',
                                'description' => 'Your private transfer will be waiting at the arrival terminal to escort you along the winding clifftop roads of the Amalfi Coast.',
                                'meta' => 'Driver contact: +39 345 678 901'
                            ],
                            [
                                'time' => '12:30 PM',
                                'type' => 'restaurant',
                                'title' => 'Lunch at Da Adolfo',
                                'description' => 'A secluded beach club restaurant accessible only by boat. Famous for their mozzarella grilled on lemon leaves.',
                                'images' => [
                                    'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop',
                                    'https://images.unsplash.com/photo-1515276427842-f85802d514a2?q=80&w=1000&auto=format&fit=crop'
                                ]
                            ],
                            [
                                'time' => '03:00 PM',
                                'type' => 'hotel',
                                'title' => 'Check-in at Le Sirenuse, Positano',
                                'description' => 'Widely considered the most romantic hotel in the world, perfectly positioned for your journey.',
                                'hotel_name' => 'Le Sirenuse, Positano',
                                'hotel_price' => 850,
                                'hotel_stars' => 5,
                                'hotel_image' => 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop'
                            ]
                        ]
                    ],
                    [
                        'day' => 2,
                        'activities' => [
                            [
                                'time' => '08:30 AM',
                                'type' => 'explore',
                                'title' => 'Hiking the Path of the Gods',
                                'description' => 'Embark on a breathtaking clifftop trail from Agerola to Nocelle, offering unmatched panoramas of the sea and the towns below.',
                                'meta' => 'Private local hiking guide provided'
                            ],
                            [
                                'time' => '06:00 PM',
                                'type' => 'restaurant',
                                'title' => 'Cooking Masterclass in Ravello',
                                'description' => 'Learn how to make authentic handmade Neapolitan pasta and lemon cake in a high-altitude organic villa garden.',
                            ]
                        ]
                    ],
                    [
                        'day' => 3,
                        'activities' => [
                            [
                                'time' => '09:00 AM',
                                'type' => 'boat',
                                'title' => 'Private Yacht Charter to Capri & Blue Grotto',
                                'description' => 'Cruise the coastline on an authentic Riva boat. Visit the dramatic sea stacks of Faraglioni and swim in the glowing Blue Grotto.',
                                'meta' => 'Snorkeling gear and champagne toast included'
                            ],
                            [
                                'time' => '08:00 PM',
                                'type' => 'restaurant',
                                'title' => 'Dinner at Villa Verde in Capri',
                                'description' => 'Dine under lemon trees on fresh seafood and hand-rolled pasta, frequented by travelers from around the world.',
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Moroccan Imperial Cities',
                'duration' => '5 Days',
                'stops' => ['Casablanca', 'Marrakech'],
                'price' => 1500.00,
                'image' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZHkOciz7N-CsZIwci1DxyGTRvHdcG3un38g&s',
                'theme' => 'Cultural',
                'budget_level' => 'Premium',
                'max_travelers' => 8,
                'activities' => [
                    [
                        'day' => 1,
                        'activities' => [
                            [
                                'time' => '02:00 PM',
                                'type' => 'flight_land',
                                'title' => 'Arrival at Casablanca Airport',
                                'description' => 'Upon arrival, your private chauffeur will meet you at the arrivals hall and transfer you directly to your hotel.',
                                'meta' => 'Driver contact: +212 522 123 456'
                            ],
                            [
                                'time' => '04:00 PM',
                                'type' => 'hotel',
                                'title' => 'Check-in at Radisson Blu Casablanca',
                                'description' => 'Check in to the Radisson Blu Casablanca City Center. Unwind in your modern 5-star room and enjoy panoramic city views.',
                                'hotel_name' => 'Radisson Blu Hotel Casablanca City Center',
                                'hotel_price' => 185,
                                'hotel_stars' => 5,
                                'hotel_image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/627454828.jpg?k=8419812f2d56edbd78d290003bdad4a43795ee533bf4d9d56b8bf608d34e3148&o=&hp=1'
                            ],
                            [
                                'time' => '08:00 PM',
                                'type' => 'restaurant',
                                'title' => 'Dinner at Rick\'s Café',
                                'description' => 'Enjoy an elegant dinner in a beautifully reconstructed piano bar inspired by the classic movie Casablanca.',
                            ]
                        ]
                    ],
                    [
                        'day' => 2,
                        'activities' => [
                            [
                                'time' => '09:30 AM',
                                'type' => 'explore',
                                'title' => 'Hassan II Mosque Tour',
                                'description' => 'Explore the majestic Hassan II Mosque, one of the largest mosques in the world, featuring a spectacular minaret overlooking the Atlantic Ocean.',
                                'meta' => 'Guided tour included'
                            ],
                            [
                                'time' => '04:00 PM',
                                'type' => 'explore',
                                'title' => 'Habous Quarter Walk',
                                'description' => 'Stroll through the scenic Habous Quarter, built by French architects with traditional Moroccan features, and taste local pastries at Bennis Habous.',
                            ]
                        ]
                    ],
                    [
                        'day' => 3,
                        'activities' => [
                            [
                                'time' => '08:00 AM',
                                'type' => 'directions_car',
                                'title' => 'Scenic Drive to Marrakech',
                                'description' => 'Take a private transfer south to Marrakech.',
                            ],
                            [
                                'time' => '02:00 PM',
                                'type' => 'hotel',
                                'title' => 'Check-in at Charming Medina Riad',
                                'description' => 'Settle in to the Charming Medina Riad in Marrakech. Experience authentic architectural design and tranquility in the historic heart of the old town.',
                                'hotel_name' => 'Charming Medina Riad',
                                'hotel_price' => 455,
                                'hotel_stars' => 4,
                                'hotel_image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/580349089.webp?k=4f46e1143559b35f677ff97af6d20ca5747aa6fcc8fd1add7d057ebad5fd6b45&o='
                            ],
                            [
                                'time' => '06:00 PM',
                                'type' => 'explore',
                                'title' => 'Jemaa el-Fnaa Sunset',
                                'description' => 'Witness the world-famous square come alive at sunset with storytellers, musicians, henna artists, and delicious food stalls.',
                            ]
                        ]
                    ],
                    [
                        'day' => 4,
                        'activities' => [
                            [
                                'time' => '09:00 AM',
                                'type' => 'explore',
                                'title' => 'Majorelle Garden & YSL Museum',
                                'description' => 'Stroll through the enchanting Majorelle Garden with its iconic cobalt blue villa, followed by a visit to the Yves Saint Laurent Museum.',
                            ],
                            [
                                'time' => '08:00 PM',
                                'type' => 'restaurant',
                                'title' => 'Dinner at Al Fassia',
                                'description' => 'Indulge in a spectacular traditional Moroccan dinner run entirely by women, famous for their slow-cooked lamb shoulder.',
                            ]
                        ]
                    ],
                    [
                        'day' => 5,
                        'activities' => [
                            [
                                'time' => '10:00 AM',
                                'type' => 'spa',
                                'title' => 'Traditional Moroccan Hammam',
                                'description' => 'Relax and rejuvenate with a traditional black soap scrub and argan oil massage at a luxury local spa.',
                                'meta' => 'Includes private treatment room'
                            ]
                        ]
                    ]
                ]
            ]
        ];

        foreach ($plans as $planData) {
            $activities = $planData['activities'] ?? [];
            $foundHotelId = null;
            $foundStayId = null;
            
            foreach ($activities as &$dayData) {
                if (isset($dayData['activities'])) {
                    foreach ($dayData['activities'] as &$act) {
                        if (isset($act['hotel_name'])) {
                            // Search in hotels table
                            $dbHotel = \App\Models\Hotel::where('name', $act['hotel_name'])->first();
                            if ($dbHotel) {
                                $act['hotel_db_id'] = $dbHotel->id;
                                $foundHotelId = $dbHotel->id;
                            }
                            
                            // Search in stays table
                            $dbStay = \App\Models\Stay::where('name', $act['hotel_name'])->first();
                            if ($dbStay) {
                                $act['stay_db_id'] = $dbStay->id;
                                $foundStayId = $dbStay->id;
                            }
                        }
                    }
                }
            }
            unset($dayData, $act);
            
            $planData['activities'] = $activities;
            $plan = Plan::create($planData);
            
            // If not found, fall back to city-based match
            if (!$foundHotelId && !$foundStayId && is_array($plan->stops) && count($plan->stops) > 0) {
                $firstCity = $plan->stops[0];
                $dbHotel = \App\Models\Hotel::where('city', $firstCity)->first();
                if ($dbHotel) {
                    $foundHotelId = $dbHotel->id;
                } else {
                    $dbStay = \App\Models\Stay::where('city', $firstCity)->first();
                    if ($dbStay) {
                        $foundStayId = $dbStay->id;
                    }
                }
            }
            
            $plan->hotel_id = $foundHotelId ?: \App\Models\Hotel::inRandomOrder()->first()?->id;
            $plan->stay_id = $foundStayId;
            
            // Assign a matching flight if possible
            if (is_array($plan->stops) && count($plan->stops) > 1) {
                $dep = $plan->stops[0];
                $arr = $plan->stops[count($plan->stops) - 1];
                $dbFlight = \App\Models\Flight::where('departure_city', $dep)
                    ->where('arrival_city', $arr)
                    ->first();
                if ($dbFlight) {
                    $plan->flight_id = $dbFlight->id;
                }
            }
            
            if (!$plan->flight_id) {
                $plan->flight_id = \App\Models\Flight::inRandomOrder()->first()?->id;
            }
            
            $plan->save();
        }
    }
}
