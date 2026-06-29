<?php

namespace Database\Seeders;

use App\Models\Stay;
use App\Models\StayImage;
use App\Models\Amenity;
use App\Models\StayRule;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StaySeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        $user = User::firstOrCreate(
            ['email' => 'admin@voyagesmart.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'Admin'
            ]
        );

        $staysData = [
            [
                'name' => 'The Lemonary Marrakech',
                'rating' => 8.9,
                'reviews_count' => 692,
                'property_type' => 'Villa',
                'bedrooms' => 2,
                'bathrooms' => 2,
                'area' => 300,
                'beds' => 2,
                'price_per_night' => 597,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/455198467.webp?k=799521c8ba210c876e542d56bd5022f212c818ab0a5909aaf7f95789dfd12a65&o='
            ],
            [
                'name' => 'Villa Le Perroquet Bleu',
                'rating' => 8.0,
                'reviews_count' => 360,
                'property_type' => 'Villa',
                'bedrooms' => 4,
                'bathrooms' => 4,
                'area' => 120,
                'beds' => 6,
                'price_per_night' => 337,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/140382767.webp?k=9a28b295f7ea6ad181fbdf54e401c2565edbcf8162fed64db147a25e01a3c817&o='
            ],
            [
                'name' => 'Tigmiza Boutique Hotel & Spa',
                'rating' => 9.1,
                'reviews_count' => 1160,
                'property_type' => 'Villa',
                'bedrooms' => 1,
                'bathrooms' => 2,
                'area' => 150,
                'beds' => 2,
                'price_per_night' => 601,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/40919490.webp?k=ceb0861d9db611ccd636cbe9d9c2d0a2cd124f4246c93bf8349ca26d1be3883a&o='
            ],
            [
                'name' => 'Villa golf prestigia marrakech',
                'rating' => 9.5,
                'reviews_count' => 81,
                'property_type' => 'Villa',
                'bedrooms' => 4,
                'bathrooms' => 3,
                'area' => 350,
                'beds' => 4,
                'price_per_night' => 386,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/470887464.webp?k=47416e65859e0eb61d5d8912bcd7a9516725c381655ac61f1c9e89618aac1cfb&o='
            ],
            [
                'name' => 'Villa Hicham Golf Marrakech',
                'rating' => 9.5,
                'reviews_count' => 9,
                'property_type' => 'Villa',
                'bedrooms' => 5,
                'bathrooms' => 4,
                'area' => 500,
                'beds' => 7,
                'price_per_night' => 639,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/780504932.webp?k=6ae0597c06fec5c417094e36c9566488270762aa19d45b011ce0e96c47852783&o='
            ],
            [
                'name' => 'Domaine Des Remparts Hotel & Spa',
                'rating' => 9.1,
                'reviews_count' => 477,
                'property_type' => 'Villa',
                'bedrooms' => 2,
                'bathrooms' => 3,
                'area' => 140,
                'beds' => 2,
                'price_per_night' => 728,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/866465394.webp?k=ca1d99d0470f8a250aa4e6ae9b2f2016b3e8fe2f43cab7c65d0e3897c9028f36&o='
            ],
            [
                'name' => 'Hacienda Marrakech',
                'rating' => 8.1,
                'reviews_count' => 79,
                'property_type' => 'Villa',
                'bedrooms' => 2,
                'bathrooms' => 1,
                'area' => 60,
                'beds' => 2,
                'price_per_night' => 185,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/788322067.webp?k=93277451cef29a2cf734175e02d566ed03ea2a36b1ec996d2b40722363cb819d&o='
            ],
            [
                'name' => 'Riad Dar Mima Hnina',
                'rating' => 9.5,
                'reviews_count' => 65,
                'property_type' => 'Villa',
                'bedrooms' => 4,
                'bathrooms' => 5,
                'area' => 500,
                'beds' => 4,
                'price_per_night' => 588,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/827032883.webp?k=56641ae1bec92486ef6be9f581cf3886c97eeeabe56cc5c263b89b807a63c95e&o='
            ],
            [
                'name' => 'Golfside Villas',
                'rating' => 8.5,
                'reviews_count' => 7,
                'property_type' => 'Villa',
                'bedrooms' => 7,
                'bathrooms' => 8,
                'area' => 539,
                'beds' => 7,
                'price_per_night' => 1247,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/798183451.webp?k=4aeebba4cfe30fc4620966ad83a28238bd423e36250b2ace7d1e7f4b9cb484a0&o='
            ],
            [
                'name' => 'Villa Paradis',
                'rating' => 7.8,
                'reviews_count' => 103,
                'property_type' => 'Villa',
                'bedrooms' => 2,
                'bathrooms' => 2,
                'area' => 320,
                'beds' => 7,
                'price_per_night' => 243,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/670450097.webp?k=93ee67dca90c87967500b54c7893f38a558ec27c651a89b5b36b6658750f38a8&o='
            ],
            [
                'name' => 'Villa Kristy',
                'rating' => 9.4,
                'reviews_count' => 337,
                'property_type' => 'Villa',
                'bedrooms' => 2,
                'bathrooms' => 2,
                'area' => 250,
                'beds' => 4,
                'price_per_night' => 266,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/91695717.webp?k=208008b35302cd9ffafdc712fa61c5cb991e051c5380c93ae19c4f4ed2e5e3b8&o='
            ],
            [
                'name' => 'La Palmeraie De L\'Atlas',
                'rating' => 8.8,
                'reviews_count' => 65,
                'property_type' => 'Villa',
                'bedrooms' => 4,
                'bathrooms' => 4,
                'area' => 1000,
                'beds' => 4,
                'price_per_night' => 440,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/83776041.webp?k=8fce8bf774fe7f137454697f249100d07b0d635184a721d67e1b8f06f28519b8&o='
            ],
            [
                'name' => 'Charming Medina Riad',
                'rating' => 8.6,
                'reviews_count' => 19,
                'property_type' => 'Villa',
                'bedrooms' => 8,
                'bathrooms' => 4,
                'area' => 180,
                'beds' => 11,
                'price_per_night' => 455,
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/580349089.webp?k=4f46e1143559b35f677ff97af6d20ca5747aa6fcc8fd1add7d057ebad5fd6b45&o='
            ],
            [
                'name' => 'Sunny Studio Ain Diab Pool & Terrace Near Beach',
                'rating' => 9.7,
                'reviews_count' => 4,
                'property_type' => 'Studio',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'area' => 45,
                'beds' => 1,
                'price_per_night' => 80,
                'location' => 'Anfa, Casablanca (Ain Diab)',
                'city' => 'Casablanca',
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/square600/844493676.webp?k=8b24c47ceaee116114ac71a00d89d095e3618c99472652d134aa588e128c776a&o='
            ],
            [
                'name' => 'Melliber Appart Hotel',
                'rating' => 8.1,
                'reviews_count' => 4016,
                'property_type' => 'Apartment',
                'bedrooms' => 2,
                'bathrooms' => 1,
                'area' => 70,
                'beds' => 2,
                'price_per_night' => 95,
                'location' => 'Sidi Belyout, Casablanca',
                'city' => 'Casablanca',
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/square600/238082254.webp?k=6dbfd60dd88a3e69be1a3679528b9156534b64fcb1166fb6bd1b4cb7060cbe5c&o='
            ],
            [
                'name' => 'Aparthotel Adagio Premium Casablanca City Center',
                'rating' => 8.0,
                'reviews_count' => 989,
                'property_type' => 'Aparthotel',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'area' => 50,
                'beds' => 1,
                'price_per_night' => 120,
                'location' => 'Maârif, Casablanca',
                'city' => 'Casablanca',
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/square600/751905334.webp?k=a36d591e59a342f324c79239afb8c451a68f1d013e898d0b688f544ab6c46f99&o='
            ],
            [
                'name' => 'Appartement Ocean View - Marina Casablanca',
                'rating' => 9.4,
                'reviews_count' => 7,
                'property_type' => 'Apartment',
                'bedrooms' => 2,
                'bathrooms' => 2,
                'area' => 110,
                'beds' => 3,
                'price_per_night' => 150,
                'location' => 'Sidi Belyout, Casablanca',
                'city' => 'Casablanca',
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/square600/505334669.webp?k=13abe4131ce3e407fe3981e0a0a0b68e6a9decf84072fc24cd83127a960d6a4e&o='
            ],
            [
                'name' => 'Le loft du soleil B living',
                'rating' => 9.2,
                'reviews_count' => 29,
                'property_type' => 'Loft',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'area' => 60,
                'beds' => 2,
                'price_per_night' => 85,
                'location' => 'Hay Hassani, Casablanca',
                'city' => 'Casablanca',
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/square600/760736218.webp?k=43bc1925069053a5a014cae15052840b6d276724b1a0f9d1878fde6fb2d9a3a5&o='
            ],
            [
                'name' => "Le 22 Appart'Hotel",
                'rating' => 8.0,
                'reviews_count' => 1056,
                'property_type' => 'Aparthotel',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'area' => 50,
                'beds' => 1,
                'price_per_night' => 110,
                'location' => 'Maârif, Casablanca',
                'city' => 'Casablanca',
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/square600/188608771.webp?k=19fc1959a5359ed7961515382ed073078a11fcdade2d99bbde31b0bbf16dc752&o='
            ],
            [
                'name' => 'NESK STAY Maarif - ARENA 41',
                'rating' => 7.4,
                'reviews_count' => 126,
                'property_type' => 'Studio',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'area' => 40,
                'beds' => 1,
                'price_per_night' => 70,
                'location' => 'Maârif, Casablanca',
                'city' => 'Casablanca',
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/square600/695028311.webp?k=c63fccc2ac296489c8cbde0c33e3e1a55056e31b7e8e1b02f67d6e48865b7d56&o='
            ],
            [
                'name' => 'Family Aparthotel',
                'rating' => 9.1,
                'reviews_count' => 2171,
                'property_type' => 'Aparthotel',
                'bedrooms' => 2,
                'bathrooms' => 2,
                'area' => 80,
                'beds' => 3,
                'price_per_night' => 130,
                'location' => 'Sidi Belyout, Casablanca',
                'city' => 'Casablanca',
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/square600/774192159.webp?k=4d541ba4867883e94cdaacaa35fa8f15bf4fe768a945e97609fc7d151a607703&o='
            ],
            [
                'name' => 'Ocean View Apartment - Anfa Place -',
                'rating' => 8.4,
                'reviews_count' => 100,
                'property_type' => 'Apartment',
                'bedrooms' => 2,
                'bathrooms' => 2,
                'area' => 120,
                'beds' => 2,
                'price_per_night' => 160,
                'location' => 'Anfa, Casablanca (Ain Diab)',
                'city' => 'Casablanca',
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/square600/672317804.webp?k=f9f1e971f151ec1b83871cb3acccaf12c82220b342ec63c9a33687654a54b78d&o='
            ],
            [
                'name' => 'Emerald 32 Bourgogne Studio',
                'rating' => 9.2,
                'reviews_count' => 29,
                'property_type' => 'Studio',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'area' => 45,
                'beds' => 1,
                'price_per_night' => 75,
                'location' => 'Anfa, Casablanca',
                'city' => 'Casablanca',
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/square600/607031500.webp?k=8d45b73b6cac0ab18c54854f3f43c137dc15c115e5d6913e3dbc263ee5d2dfc7&o='
            ],
            [
                'name' => 'High Standing & cozy apartment in central Casablanca',
                'rating' => 8.9,
                'reviews_count' => 71,
                'property_type' => 'Apartment',
                'bedrooms' => 2,
                'bathrooms' => 1,
                'area' => 90,
                'beds' => 2,
                'price_per_night' => 110,
                'location' => 'Maârif, Casablanca',
                'city' => 'Casablanca',
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/square600/419247504.webp?k=af6bb46d97d46979b4d1d5cbb87f3e72debd122ca53bef90a0c71aa758993329&o='
            ],
            [
                'name' => 'Green Horizon Family Stay Maarif Casablanca',
                'rating' => 9.5,
                'reviews_count' => 4,
                'property_type' => 'Apartment',
                'bedrooms' => 3,
                'bathrooms' => 2,
                'area' => 130,
                'beds' => 4,
                'price_per_night' => 140,
                'location' => 'Maârif, Casablanca',
                'city' => 'Casablanca',
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/square600/868538602.webp?k=79a7a733b026053506c231c3cd3a89169f848344e4a3ee391b962797b64c7978&o='
            ],
            [
                'name' => 'Gauthier Living by ShortStayMaroc',
                'rating' => 7.0,
                'reviews_count' => 210,
                'property_type' => 'Apartment',
                'bedrooms' => 2,
                'bathrooms' => 1,
                'area' => 80,
                'beds' => 2,
                'price_per_night' => 85,
                'location' => 'Sidi Belyout, Casablanca (Gauthier)',
                'city' => 'Casablanca',
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/square600/705594289.webp?k=a9664dba108c43eb6233c3b16d0e3cae54154ba846b8acf4ff9250bd44c517c2&o='
            ],
            [
                'name' => 'ZEN Suites Hotel Massira',
                'rating' => 8.5,
                'reviews_count' => 381,
                'property_type' => 'Aparthotel',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'area' => 50,
                'beds' => 1,
                'price_per_night' => 105,
                'location' => 'Maârif, Casablanca',
                'city' => 'Casablanca',
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/square600/860654832.webp?k=4d4b76a5ef2c12ef9984cd0df7d6dbac9cd75f6cbb6e017222e69e319337166d&o='
            ],
            [
                'name' => 'Charmant Studio - Vue sur mer',
                'rating' => 6.8,
                'reviews_count' => 8,
                'property_type' => 'Studio',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'area' => 35,
                'beds' => 1,
                'price_per_night' => 65,
                'location' => 'Sidi Belyout, Casablanca',
                'city' => 'Casablanca',
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/square600/607410446.webp?k=a36bf97d02d1dc9326908637207881777fa4932290bd8c9c39e73b4ad7639d3a&o='
            ],
            [
                'name' => 'CFC Luxury View Appt Anfa park',
                'rating' => 8.0,
                'reviews_count' => 40,
                'property_type' => 'Apartment',
                'bedrooms' => 2,
                'bathrooms' => 2,
                'area' => 100,
                'beds' => 2,
                'price_per_night' => 135,
                'location' => 'Hay Hassani, Casablanca',
                'city' => 'Casablanca',
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/square600/565832435.webp?k=b7f9d5bde4f4c65ae69875390954f36a80d396d12291540f7f7f5fc034449b74&o='
            ],
            [
                'name' => 'Spacious apartment beachfront city center',
                'rating' => 8.8,
                'reviews_count' => 65,
                'property_type' => 'Apartment',
                'bedrooms' => 3,
                'bathrooms' => 2,
                'area' => 140,
                'beds' => 3,
                'price_per_night' => 155,
                'location' => 'Anfa, Casablanca',
                'city' => 'Casablanca',
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/square600/682999324.webp?k=e0f4cadf0f62d4785130f7b70b70f7f865d1682cb57017b37638509e39d80fc7&o='
            ],
            [
                'name' => 'Luxury Casablanca Residence Appartement & Studio',
                'rating' => 9.4,
                'reviews_count' => 22,
                'property_type' => 'Apartment',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'area' => 55,
                'beds' => 1,
                'price_per_night' => 90,
                'location' => 'Maârif, Casablanca',
                'city' => 'Casablanca',
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/square600/801463145.webp?k=5af3946ae5ee6d7d5a4a1a412e370a1c5683865b820b889fb1af72ce1e717f23&o='
            ],
            [
                'name' => 'CityZen',
                'rating' => 9.6,
                'reviews_count' => 25,
                'property_type' => 'Apartment',
                'bedrooms' => 2,
                'bathrooms' => 1,
                'area' => 75,
                'beds' => 2,
                'price_per_night' => 100,
                'location' => 'Maârif, Casablanca',
                'city' => 'Casablanca',
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/square600/774564589.webp?k=39ceff346a8d2bbb1057372667ed28e1f01fd434ad1c8f649ecc55b74d50b767&o='
            ],
            [
                'name' => 'Luxury Secure Residence, Pool, Near Beach',
                'rating' => 9.0,
                'reviews_count' => 10,
                'property_type' => 'Apartment',
                'bedrooms' => 2,
                'bathrooms' => 2,
                'area' => 90,
                'beds' => 2,
                'price_per_night' => 115,
                'location' => 'Casablanca',
                'city' => 'Casablanca',
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/square600/765581396.webp?k=3ef2ade03ae7462ba286704fa70a93d65ad56b7b1c1b7ef77f8c179a86128f95&o='
            ],
            [
                'name' => 'Central Maarif Studio',
                'rating' => 8.5,
                'reviews_count' => 15,
                'property_type' => 'Studio',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'area' => 40,
                'beds' => 1,
                'price_per_night' => 60,
                'location' => 'Maârif, Casablanca',
                'city' => 'Casablanca',
                'image' => 'https://cf.bstatic.com/xdata/images/hotel/square600/677470860.webp?k=dfd304364bb000c95824a5f95117148f7e2a29147b56787c5f8942b7ec2a4d93&o='
            ]
        ];

        // Seed basic amenities if they don't exist
        $amenityNames = ['WiFi', 'Pool', 'Kitchen', 'Parking', 'Spa', 'Fitness Center', 'Restaurant', 'Room Service', 'Bar'];
        foreach ($amenityNames as $name) {
            Amenity::firstOrCreate(['name' => $name]);
        }
        $allAmenities = Amenity::all();

        foreach ($staysData as $data) {
            $slug = \Illuminate\Support\Str::slug($data['name']);
            
            $stay = Stay::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $data['name'],
                    'description' => 'Experience luxury in ' . ($data['city'] ?? 'Marrakech') . ' with this stunning property featuring world-class amenities and breathtaking views.',
                    'location' => $data['location'] ?? 'Marrakech, Morocco',
                    'city' => $data['city'] ?? 'Marrakech',
                    'country' => 'Morocco',
                    'property_type' => $data['property_type'],
                    'guests' => $data['beds'] * 2,
                    'bedrooms' => $data['bedrooms'],
                    'beds' => $data['beds'],
                    'bathrooms' => $data['bathrooms'],
                    'area' => $data['area'],
                    'price_per_night' => $data['price_per_night'],
                    'is_active' => true,
                    'is_highly_rated' => $data['rating'] > 9,
                    'rating' => $data['rating'],
                    'reviews_count' => $data['reviews_count'],
                    'user_id' => $user->id
                ]
            );

            // Add Image
            $stay->images()->delete();
            
            StayImage::create([
                'stay_id' => $stay->id,
                'image' => $data['image'],
                'is_main' => true,
                'order' => 0
            ]);

            // Add some gallery images (placeholder)
            for ($i = 1; $i <= 3; $i++) {
                StayImage::create([
                    'stay_id' => $stay->id,
                    'image' => 'https://images.unsplash.com/photo-' . ['1499793983690-e29da59ef1c2', '1613490908653-fd8fb92797cc', '1582268611958-ebfd161ef9cf'][rand(0, 2)] . '?q=80&w=2070&auto=format&fit=crop',
                    'is_main' => false,
                    'order' => $i
                ]);
            }

            // Add Amenities using sync
            $stay->amenities()->sync(
                $allAmenities->random(rand(4, 7))->pluck('id')->toArray()
            );

            // Add Rules
            if ($stay->rules()->count() === 0) {
                StayRule::create([
                    'stay_id' => $stay->id,
                    'rule' => 'No smoking inside'
                ]);
            }
        }
    }
}
