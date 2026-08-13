const mongoose = require("mongoose");
const Car = require("./Models/Car");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/rentx";

const seedCars = [
  {
    name: "Mahindra Thar",
    price: 3500,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop",
    description: "Rugged 4x4 off-roader, perfect for adventurous road trips and rough terrains.",
    available: true
  },
  {
    name: "Hyundai Creta",
    price: 2800,
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=800&auto=format&fit=crop",
    description: "Vibrant mid-size SUV packed with premium tech and absolute comfort.",
    available: true
  },
  {
    name: "Maruti Suzuki Swift",
    price: 1500,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800&auto=format&fit=crop",
    description: "Agile, compact hatchback with high mileage. Perfect for navigating city traffic.",
    available: true
  },
  {
    name: "Toyota Innova Crysta",
    price: 4000,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format&fit=crop",
    description: "Spacious multi-purpose vehicle designed for absolute luxury and family road trips.",
    available: true
  },
  {
    name: "Tata Nexon",
    price: 2200,
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=800&auto=format&fit=crop",
    description: "Highly-safe compact SUV offering smooth driving dynamics and modern styling.",
    available: true
  },
  {
    name: "Mahindra XUV700",
    price: 2150000,
    image: "https://images.unsplash.com/photo-1632245889027-e406faaa19ee?q=80&w=800&auto=format&fit=crop",
    description: "Premium smart SUV for sale. Loaded with ADAS safety features, panoramic sunroof, and luxury cabin.",
    purpose: "sale",
    available: true
  },
  {
    name: "Hyundai Verna",
    price: 1450000,
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800&auto=format&fit=crop",
    description: "Futuristic sedan for sale. Features a turbo petrol engine, dynamic styling, and absolute comfort.",
    purpose: "sale",
    available: true
  },
  {
    name: "Maruti Suzuki Baleno",
    price: 880000,
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=800&auto=format&fit=crop",
    description: "Premium hatchback for sale. High efficiency, comfortable seating, and smart connectivity.",
    purpose: "sale",
    available: true
  }
];

mongoose
  .connect(MONGODB_URI, { dbName: "rentx" })
  .then(async () => {
    console.log("Connected to MongoDB for seeding...");
    // Clear old cars
    await Car.deleteMany({});
    console.log("Cleared old car records.");

    // Insert new seed cars
    await Car.insertMany(seedCars);
    console.log("Successfully seeded new standard economy cars!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error seeding database:", err);
    process.exit(1);
  });
