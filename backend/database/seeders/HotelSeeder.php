<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Hotel;
use App\Models\Amenity;
use App\Models\User;

class HotelSeeder extends Seeder
{
    public function run()
    {
        $admin = User::where('role', 'admin')->first() ?: User::first();
        if (!$admin) return;

        // Ensure some amenities exist
        $amenityNames = ['WiFi', 'Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Parking', 'Room Service', 'Bar'];
        foreach ($amenityNames as $name) {
            Amenity::firstOrCreate(['name' => $name]);
        }
        $allAmenities = Amenity::all();

        $hotels = [
            [
                'name' => 'Hotel Grande Bretagne',
                'location' => 'Syntagma Square, Athens',
                'city' => 'Athens',
                'country' => 'Greece',
                'description' => 'Boasting a prime location, opposite Constitution Square and the House of Parliament, the Grande Bretagne features luxurious rooms and stunning city views from its magnificent rooftop terrace.',
                'price' => 450,
                'image' => 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop',
                'stars' => 5,
                'is_premier' => true,
                'rating' => 9.2,
                'reviews_count' => 1205
            ],
            [
                'name' => 'Eliassen Rorbuer',
                'location' => 'Hamnøy, Reine',
                'city' => 'Lofoten',
                'country' => 'Norway',
                'description' => 'Experience a stay in a beautifully restored traditional red fishermen\'s cabin built on stilts directly over the Arctic waters.',
                'price' => 380,
                'image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
                'stars' => 4,
                'is_premier' => false,
                'rating' => 9.0,
                'reviews_count' => 840
            ],
            [
                'name' => 'Hakone Ginyu Ryokan',
                'location' => 'Hakone, Ashigarashimo District',
                'city' => 'Hakone',
                'country' => 'Japan',
                'description' => 'A luxurious traditional Japanese inn offering private hot spring baths in every room with breathtaking views of the Hakone mountains.',
                'price' => 600,
                'image' => 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop',
                'stars' => 5,
                'is_premier' => true,
                'rating' => 9.5,
                'reviews_count' => 420
            ],
            [
                'name' => 'Le Sirenuse, Positano',
                'location' => 'Via Cristoforo Colombo, Positano',
                'city' => 'Positano',
                'country' => 'Italy',
                'description' => 'Widely considered the most romantic hotel in the world, perfectly positioned for your journey along the Amalfi coast.',
                'price' => 850,
                'image' => 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop',
                'stars' => 5,
                'is_premier' => true,
                'rating' => 9.8,
                'reviews_count' => 2150
            ],
            [
                'name' => 'Radisson Blu Hotel Casablanca City Center',
                'location' => 'Boulevard Mohamed V, Sidi Belyout',
                'city' => 'Casablanca',
                'country' => 'Morocco',
                'description' => 'Located in Casablanca, 3.3 km from Hassan II Mosque, Radisson Blu Hotel Casablanca City Center provides accommodation with a fitness centre, free private parking, a restaurant and a bar. This 5-star hotel offers a concierge service and luggage storage space.',
                'price' => 185,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/627454828.jpg?k=8419812f2d56edbd78d290003bdad4a43795ee533bf4d9d56b8bf608d34e3148&o=&hp=1',
                'stars' => 5,
                'is_premier' => true,
                'rating' => 8.3,
                'reviews_count' => 898
            ],
            [
                'name' => 'Radisson Hotel Casablanca Gauthier La Citadelle',
                'location' => 'Sidi Belyout, Casablanca (Gauthier)',
                'city' => 'Casablanca',
                'country' => 'Morocco',
                'description' => 'Situated in Casablanca, 4.3 km from Anfa Place Living Resort, Radisson Hotel Casablanca Gauthier La Citadelle features accommodation with a terrace, free private parking, a restaurant and a bar.',
                'price' => 160,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/619769240.jpg?k=027f4f1785de7623c75467623f2003e8dc8e9cbd4e0440907c4ab6e8b9774d80&o=&hp=1',
                'stars' => 4,
                'is_premier' => false,
                'rating' => 8.8,
                'reviews_count' => 1720
            ],
            [
                'name' => 'Barceló Anfa Casablanca',
                'location' => '44 Boulevard d\'Anfa, Sidi Belyout',
                'city' => 'Casablanca',
                'country' => 'Morocco',
                'description' => 'Located in Casablanca, 3.8 km from Anfa Place Living Resort, Barceló Anfa Casablanca provides accommodation with an outdoor swimming pool, free private parking, a fitness centre and a shared lounge.',
                'price' => 210,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/450293869.jpg?k=cb064e4c3d6ace8142766d1664d18c60d6f5528432447b9037aef8f7442869c1&o=&hp=1',
                'stars' => 5,
                'is_premier' => true,
                'rating' => 8.4,
                'reviews_count' => 1113
            ],
            [
                'name' => 'Courtyard by Marriott Casablanca Downtown',
                'location' => 'Avenue Hassan II, Maarif',
                'city' => 'Casablanca',
                'country' => 'Morocco',
                'description' => 'Set in Casablanca, 5.6 km from Anfa Place Living Resort, Courtyard by Marriott Casablanca Downtown offers accommodation with an outdoor swimming pool, free private parking, a fitness centre and a bar.',
                'price' => 145,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/664377621.jpg?k=0a1ad666fd50787c0fb7fa3e7958f9eafa279dd0140774ebd98e7059af7e091c&o=&hp=1',
                'stars' => 4,
                'is_premier' => false,
                'rating' => 8.7,
                'reviews_count' => 1095
            ],
            [
                'name' => 'Kenzi Tower Hotel',
                'location' => 'Twin Center, Boulevard Zerktouni, Maarif',
                'city' => 'Casablanca',
                'country' => 'Morocco',
                'description' => 'Located in one of Casablanca\'s Twin Centre towers, this 5-star hotel offers panoramic views of the city, port and Hassan II Mosque. It features a spa with an indoor pool and a fitness centre.',
                'price' => 250,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/371915092.jpg?k=fc7320852bc1dd0b4c3195870e455d0e009aac9a80c37fe4386494f1a6992ae8&o=&hp=1',
                'stars' => 5,
                'is_premier' => true,
                'rating' => 8.0,
                'reviews_count' => 1754
            ],
            [
                'name' => 'Royal Mansour Casablanca',
                'location' => '27 Avenue des FAR, Sidi Belyout',
                'city' => 'Casablanca',
                'country' => 'Morocco',
                'description' => 'The Royal Mansour Casablanca, originally built in 1953, is an emblematic building of Casablanca. It offers ultra-luxury suites and a world-class spa experience.',
                'price' => 850,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/546799296.jpg?k=f872402546ee1b9d88dd1596a7b1cbe8a0cd94e61aac2a809aedfe5ca9eb4c1d&o=&hp=1',
                'stars' => 5,
                'is_premier' => true,
                'rating' => 9.5,
                'reviews_count' => 265
            ],
            [
                'name' => 'Four Seasons Hotel Casablanca',
                'location' => 'Boulevard de la Corniche, Anfa',
                'city' => 'Casablanca',
                'country' => 'Morocco',
                'description' => 'Located in Casablanca, beside Anfa Place Living Resort, Four Seasons Hotel Casablanca boasts a spa centre and fitness centre. The hotel has a year-round outdoor pool and terrace.',
                'price' => 450,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/69012540.jpg?k=49d8ffbcf700ada7c83178792e1e211d8021e2a2fd840fbea97ad9705568f892&o=&hp=1',
                'stars' => 5,
                'is_premier' => true,
                'rating' => 9.0,
                'reviews_count' => 974
            ],
            [
                'name' => 'Kenzi Basma',
                'location' => '35 Avenue Moulay Hassan I, Sidi Belyout',
                'city' => 'Casablanca',
                'country' => 'Morocco',
                'description' => 'Located in the heart of Casablanca, Kenzi Basma offers comfortable and modern rooms with a focus on business travelers and city explorers.',
                'price' => 75,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/675541685.jpg?k=a8899f0d1e233de3733f372e9866a7490162e4d0f48c2658f196e1b105029019&o=&hp=1',
                'stars' => 4,
                'is_premier' => false,
                'rating' => 8.2,
                'reviews_count' => 910
            ],
            [
                'name' => 'Hyatt Regency Casablanca',
                'location' => 'Place des Nations Unies, Sidi Belyout',
                'city' => 'Casablanca',
                'country' => 'Morocco',
                'description' => 'A landmark 5-star hotel in Casablanca, featuring luxury rooms, a night club, and multiple gourmet restaurants right next to the Old Medina.',
                'price' => 195,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/457942021.jpg?k=a0ed22b689a91b5bce37a0de1642b7ee45e65d5cd8d44ed5728dac6e7a83b3c2&o=&hp=1',
                'stars' => 5,
                'is_premier' => true,
                'rating' => 8.1,
                'reviews_count' => 1052
            ],
            [
                'name' => 'Royal Hideaway Casablanca',
                'location' => 'Boulevard des FAR, Sidi Belyout',
                'city' => 'Casablanca',
                'country' => 'Morocco',
                'description' => 'Experience the height of luxury at Royal Hideaway. This exceptional hotel offers deluxe rooms and an atmosphere of refined elegance in the city center.',
                'price' => 215,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/810272941.jpg?k=3ae2078c32d7863f0c23d0debe6eb59fc91ad05910e27afa6f042d31ffaed97a&o=&hp=1',
                'stars' => 5,
                'is_premier' => true,
                'rating' => 9.5,
                'reviews_count' => 54
            ],
            [
                'name' => 'Le Casablanca Hotel',
                'location' => 'Boulevard Moulay Rachid, Anfa',
                'city' => 'Casablanca',
                'country' => 'Morocco',
                'description' => 'A boutique luxury experience in the prestigious Anfa neighborhood. Le Casablanca Hotel combines classic charm with modern amenities and a beautiful pool.',
                'price' => 310,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/471458738.jpg?k=78f8661efb09dbb97d51b0ea3d9905a9401701ea97c0a7d49d4388e78a620565&o=&hp=1',
                'stars' => 5,
                'is_premier' => true,
                'rating' => 8.3,
                'reviews_count' => 385
            ]
        ];

        foreach ($hotels as $hotelData) {
            $hotel = Hotel::updateOrCreate(
                ['name' => $hotelData['name']],
                [
                    'location' => $hotelData['location'],
                    'city' => $hotelData['city'],
                    'country' => $hotelData['country'],
                    'description' => $hotelData['description'],
                    'price' => $hotelData['price'],
                    'image' => $hotelData['image'],
                    'stars' => $hotelData['stars'],
                    'is_premier' => $hotelData['is_premier'],
                    'rating' => $hotelData['rating'],
                    'reviews_count' => $hotelData['reviews_count'],
                    'user_id' => $admin->id,
                    'is_active' => true,
                    'total_rooms' => $total = rand(10, 50),
                    'available_rooms' => $total - rand(0, 5) // Start with some rooms booked
                ]
            );

            // Assign random amenities (using sync to avoid duplicates)
            $hotel->amenities()->sync(
                $allAmenities->random(rand(4, 8))->pluck('id')->toArray()
            );

            // Clear existing gallery images to avoid duplicates
            $hotel->images()->delete();

            // Add some gallery images (placeholder)
            for ($i = 1; $i <= 3; $i++) {
                $hotel->images()->create([
                    'image' => $hotelData['image'], // Re-use main for demo gallery
                    'is_main' => false
                ]);
            }
        }
    }
}
