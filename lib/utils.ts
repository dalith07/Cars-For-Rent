import {
  Category,
  ImagesOnCars,
  ItemsCars,
  Model,
  Order,
  OrderItem,
  Profile,
  User,
} from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export type UserWithProfile = User & { Profile: Profile };

export type UserWithProfile = User & { Profile: Profile | null };

export type ItemsCarsWithAll = ItemsCars & {
  category: Category;
  model: Model;
  imagesOnCars: ImagesOnCars[];
};

export type ItemsCarsWithAlll = ItemsCars & {
  category: Category | null;
  model: Model | null;
  imagesOnCars: ImagesOnCars[];
};

export type OrderWithAll = Order & {
  items: OrderItem[];
  user: User | null;
};

// export const models = [
//    // setModels([
//             //     { id: "tesla_model_s", name: "Tesla Model S", brand: "Tesla" },
//             //     { id: "tesla_model_3", name: "Tesla Model 3", brand: "Tesla" },
//             //     // { id: "tesla_model_x", name: "Tesla Model X", brand: "Tesla" },
//             //     // { id: "tesla_model_y", name: "Tesla Model Y", brand: "Tesla" },

//             //     { id: "audi_a4", name: "Audi A4", brand: "Audi" },
//             //     // { id: "audi_a6", name: "Audi A6" },
//             //     // { id: "audi_a8", name: "Audi A8" },
//             //     // { id: "audi_q5", name: "Audi Q5" },
//             //     // { id: "audi_q7", name: "Audi Q7" },

//             //     { id: "golf_7", name: "Golf 7", brand: "Golf" },
//             //     // { id: "golf_7r", name: "Golf 7R" },
//             //     // { id: "golf_8", name: "Golf 8" },

//             //     { id: "bmw_3series", name: "BMW 3 Series", brand: "BMW" },
//             //     // { id: "bmw_5series", name: "BMW 5 Series" },
//             //     // { id: "bmw_7series", name: "BMW 7 Series" },
//             //     // { id: "bmw_m3", name: "BMW M3" },
//             //     // { id: "bmw_m4", name: "BMW M4" },
//             //     // { id: "bmw_x5", name: "BMW X5" },
//             //     // { id: "bmw_x6", name: "BMW X6" },
//             //     // { id: "bmw_f30", name: "BMW F30 M Sport" },

//             //     { id: "mercedes_a_class", name: "Mercedes A-Class", brand: "Mercedes" },
//             //     // { id: "mercedes_c_class", name: "Mercedes C-Class" },
//             //     // { id: "mercedes_e_class", name: "Mercedes E-Class" },
//             //     // { id: "mercedes_s_class", name: "Mercedes S-Class" },
//             //     // { id: "mercedes_g_class", name: "Mercedes G-Class" },

//             //     { id: "toyota_corolla", name: "Toyota Corolla", brand: "Toyota" },
//             //     // { id: "toyota_camry", name: "Toyota Camry" },
//             //     // { id: "toyota_supra", name: "Toyota Supra" },
//             //     // { id: "toyota_prius", name: "Toyota Prius" },
//             //     // { id: "toyota_rav4", name: "Toyota RAV4" },

//             //     { id: "nissan_gt_r", name: "Nissan GT-R", brand: "Nissan" },
//             //     // { id: "nissan_altima", name: "Nissan Altima" },
//             //     // { id: "nissan_370z", name: "Nissan 370Z" },
//             //     // { id: "nissan_leaf", name: "Nissan Leaf" },

//             //     { id: "honda_civic", name: "Honda Civic", brand: "Honda" },
//             //     // { id: "honda_accord", name: "Honda Accord" },
//             //     // { id: "honda_nsx", name: "Honda NSX" },
//             //     // { id: "honda_crv", name: "Honda CR-V" },

//             //     { id: "ford_mustang", name: "Ford Mustang", brand: "Ford" },
//             //     // { id: "ford_focus", name: "Ford Focus" },
//             //     // { id: "ford_f150", name: "Ford F-150" },
//             //     // { id: "ford_explorer", name: "Ford Explorer" },
//             //     // { id: "ford_gt", name: "Ford GT" },

//             //     { id: "chevrolet_camaro", name: "Chevrolet Camaro", brand: "Chevrolet" },
//             //     // { id: "chevrolet_corvette", name: "Chevrolet Corvette" },
//             //     // { id: "chevrolet_malibu", name: "Chevrolet Malibu" },
//             //     // { id: "chevrolet_tahoe", name: "Chevrolet Tahoe" },

//             //     { id: "porsche_911", name: "Porsche 911", brand: "Porsche" },
//             //     // { id: "porsche_cayenne", name: "Porsche Cayenne" },
//             //     // { id: "porsche_taycan", name: "Porsche Taycan" },

//             //     { id: "lamborghini_aventador", name: "Lamborghini Aventador", brand: "Lamborghini" },
//             //     // { id: "lamborghini_huracan", name: "Lamborghini Huracán" },
//             //     // { id: "lamborghini_urus", name: "Lamborghini Urus" },

//             //     { id: "ferrari_488", name: "Ferrari 488", brand: "Ferrari" },
//             //     // { id: "ferrari_f8", name: "Ferrari F8 Tributo" },
//             //     // { id: "ferrari_sf90", name: "Ferrari SF90 Stradale" },

//             //     { id: "mclaren_720s", name: "McLaren 720S", brand: "McLaren" },
//             //     // { id: "mclaren_p1", name: "McLaren P1" },
//             //     // { id: "mclaren_artura", name: "McLaren Artura" },

//             //     { id: "bugatti_chiron", name: "Bugatti Chiron", brand: "Bugatti" },
//             //     { id: "bugatti_veyron", name: "Bugatti Veyron", brand: "Bugatti" },

//             //     { id: "rolls_royce_phantom", name: "Rolls-Royce Phantom", brand: "Rolls-Royce" },
//             //     // { id: "rolls_royce_ghost", name: "Rolls-Royce Ghost" },
//             //     // { id: "rolls_royce_cullinan", name: "Rolls-Royce Cullinan" },

//             //     { id: "bentley_continental", name: "Bentley Continental GT", brand: "Bentley" },
//             //     // { id: "bentley_flying_spur", name: "Bentley Flying Spur" },
//             //     // { id: "bentley_bentayga", name: "Bentley Bentayga" },
//             // ]);
// ]

export const models = [
  { id: "tesla_model_s", name: "Tesla Model S", brand: "Tesla" },
  { id: "tesla_model_3", name: "Tesla Model 3", brand: "Tesla" },

  { id: "audi_a4", name: "Audi A4", brand: "Audi" },

  { id: "golf_7", name: "Golf 7", brand: "Golf" },

  { id: "bmw_3series", name: "BMW 3 Series", brand: "BMW" },

  { id: "mercedes_a_class", name: "Mercedes A-Class", brand: "Mercedes" },

  { id: "toyota_corolla", name: "Toyota Corolla", brand: "Toyota" },

  { id: "nissan_gt_r", name: "Nissan GT-R", brand: "Nissan" },

  { id: "honda_civic", name: "Honda Civic", brand: "Honda" },

  { id: "ford_mustang", name: "Ford Mustang", brand: "Ford" },

  { id: "chevrolet_camaro", name: "Chevrolet Camaro", brand: "Chevrolet" },

  { id: "porsche_911", name: "Porsche 911", brand: "Porsche" },

  {
    id: "lamborghini_aventador",
    name: "Lamborghini Aventador",
    brand: "Lamborghini",
  },

  { id: "ferrari_488", name: "Ferrari 488", brand: "Ferrari" },

  { id: "mclaren_720s", name: "McLaren 720S", brand: "McLaren" },

  { id: "bugatti_chiron", name: "Bugatti Chiron", brand: "Bugatti" },
  { id: "bugatti_veyron", name: "Bugatti Veyron", brand: "Bugatti" },

  {
    id: "rolls_royce_phantom",
    name: "Rolls-Royce Phantom",
    brand: "Rolls-Royce",
  },

  {
    id: "bentley_continental",
    name: "Bentley Continental GT",
    brand: "Bentley",
  },
];
