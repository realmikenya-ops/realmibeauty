import vendor1 from "@/assets/vendor-1.jpg";
import vendor2 from "@/assets/vendor-2.jpg";
import vendor3 from "@/assets/vendor-3.jpg";
import vendor4 from "@/assets/vendor-4.jpg";

export type Vendor = {
  id: string;
  name: string;
  type: "Salon" | "Barber" | "Nails" | "Braiding";
  location: string;
  area: string;
  rating: number;
  reviews: number;
  priceFrom: number;
  image: string;
  tags: string[];
  services: { name: string; price: number; duration: string }[];
};

export const vendors: Vendor[] = [
  {
    id: "luxe-crown-salon",
    name: "Luxe Crown Salon",
    type: "Salon",
    location: "Westlands, Nairobi",
    area: "Westlands",
    rating: 4.9,
    reviews: 312,
    priceFrom: 800,
    image: vendor1,
    tags: ["Haircut", "Treatment", "Styling"],
    services: [
      { name: "Wash & Blow Dry", price: 1200, duration: "45 min" },
      { name: "Silk Press", price: 2500, duration: "1h 30m" },
      { name: "Deep Conditioning", price: 1500, duration: "1h" },
      { name: "Haircut & Style", price: 1800, duration: "1h" },
    ],
  },
  {
    id: "kings-kinyozi",
    name: "Kings Kinyozi",
    type: "Barber",
    location: "CBD, Nairobi",
    area: "CBD",
    rating: 4.8,
    reviews: 540,
    priceFrom: 300,
    image: vendor2,
    tags: ["Fade", "Shave", "Lineup"],
    services: [
      { name: "Classic Haircut", price: 400, duration: "30 min" },
      { name: "Skin Fade", price: 600, duration: "45 min" },
      { name: "Beard Trim & Shave", price: 350, duration: "20 min" },
      { name: "Hot Towel Shave", price: 800, duration: "40 min" },
    ],
  },
  {
    id: "gold-tips-nails",
    name: "Gold Tips Nails & Beauty",
    type: "Nails",
    location: "Kilimani, Nairobi",
    area: "Kilimani",
    rating: 4.9,
    reviews: 224,
    priceFrom: 700,
    image: vendor3,
    tags: ["Gel", "Acrylic", "Pedicure"],
    services: [
      { name: "Gel Manicure", price: 1200, duration: "1h" },
      { name: "Acrylic Full Set", price: 2500, duration: "1h 30m" },
      { name: "Spa Pedicure", price: 1500, duration: "1h" },
      { name: "Nail Art", price: 500, duration: "20 min" },
    ],
  },
  {
    id: "afrochic-braids",
    name: "AfroChic Braiding House",
    type: "Braiding",
    location: "Karen, Nairobi",
    area: "Karen",
    rating: 4.7,
    reviews: 188,
    priceFrom: 2500,
    image: vendor4,
    tags: ["Knotless", "Locs", "Twists"],
    services: [
      { name: "Knotless Braids", price: 4500, duration: "5h" },
      { name: "Box Braids", price: 3500, duration: "4h" },
      { name: "Faux Locs", price: 5500, duration: "6h" },
      { name: "Cornrows", price: 1500, duration: "2h" },
    ],
  },
];