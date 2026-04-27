export interface Patient {
  name: string;
  email: string;
  city: string;
  filename: string;
  label: "tumor" | "no_tumor";
  probability: number;
  confidence: number;
  minutesAgo: number;
}

export const PATIENTS: Patient[] = [
  {
    name: "Marek Horváth",
    email: "m.horvath@gmail.com",
    city: "Košice",
    filename: "Y23.jpg",
    label: "tumor",
    probability: 0.87,
    confidence: 0.87,
    minutesAgo: 4,
  },
  {
    name: "Jana Kováčová",
    email: "jana.kovacova@seznam.cz",
    city: "Prešov",
    filename: "34 no.jpg",
    label: "no_tumor",
    probability: 0.09,
    confidence: 0.91,
    minutesAgo: 17,
  },
  {
    name: "Tomáš Baláž",
    email: "t.balaz@email.sk",
    city: "Bratislava",
    filename: "Y45.jpg",
    label: "tumor",
    probability: 0.76,
    confidence: 0.76,
    minutesAgo: 38,
  },
  {
    name: "Lucia Šimková",
    email: "lucia.simkova@post.sk",
    city: "Banská Bystrica",
    filename: "21 no.jpg",
    label: "no_tumor",
    probability: 0.12,
    confidence: 0.88,
    minutesAgo: 55,
  },
  {
    name: "Peter Novák",
    email: "peter.novak@gmail.com",
    city: "Žilina",
    filename: "Y67.jpg",
    label: "tumor",
    probability: 0.94,
    confidence: 0.94,
    minutesAgo: 82,
  },
  {
    name: "Katarína Žitná",
    email: "k.zitna@centrum.sk",
    city: "Nitra",
    filename: "15 no.jpg",
    label: "no_tumor",
    probability: 0.21,
    confidence: 0.79,
    minutesAgo: 101,
  },
  {
    name: "Milan Oravec",
    email: "milan.oravec@azet.sk",
    city: "Trenčín",
    filename: "Y12.jpg",
    label: "tumor",
    probability: 0.82,
    confidence: 0.82,
    minutesAgo: 134,
  },
  {
    name: "Veronika Fialová",
    email: "vfialova@gmail.com",
    city: "Trnava",
    filename: "10 no.jpg",
    label: "no_tumor",
    probability: 0.05,
    confidence: 0.95,
    minutesAgo: 178,
  },
  {
    name: "Jakub Sloboda",
    email: "j.sloboda@email.sk",
    city: "Michalovce",
    filename: "Y100.JPG",
    label: "tumor",
    probability: 0.71,
    confidence: 0.71,
    minutesAgo: 215,
  },
  {
    name: "Marta Benková",
    email: "marta.benkova@post.sk",
    city: "Spišská Nová Ves",
    filename: "12 no.jpg",
    label: "no_tumor",
    probability: 0.17,
    confidence: 0.83,
    minutesAgo: 267,
  },
];
