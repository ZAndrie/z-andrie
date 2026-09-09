export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  imageUrl: string;
  order?: number;
}

export const certificatesData: Certificate[] = [
  {
    id: "cert-1",
    title: "Full Stack Web Development",
    issuer: "Cor Jesu College - ICT Department",
    date: "2024",
    imageUrl: "/download/Development.jpg",
    order: 1,
  },
  {
    id: "cert-2",
    title: "UI/UX & Modern Web Design",
    issuer: "Figma & Creative Technologies",
    date: "2024",
    imageUrl: "/download/Figma.jpg",
    order: 2,
  },
  {
    id: "cert-3",
    title: "Cloud Computing & Server Management",
    issuer: "Information Technology Specialist",
    date: "2023",
    imageUrl: "/download/Cloud.jpg",
    order: 3,
  },
  {
    id: "cert-4",
    title: "Advanced JavaScript & TypeScript Architecture",
    issuer: "Modern Web Engineering",
    date: "2023",
    imageUrl: "/download/Webdesign.jpg",
    order: 4,
  },
];
