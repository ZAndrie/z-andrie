export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  imageUrl: string;
  repoUrl?: string;
  order?: number;
}

export const certificatesData: Certificate[] = [
  {
    id: "cert-1792723337507",
    title: "Base PH Certificate of Participation",
    issuer: "Davao Defi Community",
    date: "Sept 19, 2025",
    imageUrl: "https://raw.githubusercontent.com/ZAndrie/portfolio-contents/main/certificates/base-ph-certificate-of-participation.png",
    repoUrl: "https://github.com/ZAndrie/portfolio-contents/blob/main/certificates/base-ph-certificate-of-participation.png",
    order: 1
  },
  {
    id: "cert-1792723391877",
    title: "Rust School Certificate",
    issuer: "H.E.R DAO",
    date: "2026",
    imageUrl: "https://raw.githubusercontent.com/ZAndrie/portfolio-contents/main/certificates/rust-school-certificate.png",
    repoUrl: "https://github.com/ZAndrie/portfolio-contents/blob/main/certificates/rust-school-certificate.png",
    order: 2
  },
  {
    id: "cert-1792736034666",
    title: "Wadhwani Certificate",
    issuer: "Wadhwani",
    date: "July 31, 2026",
    imageUrl: "https://raw.githubusercontent.com/ZAndrie/portfolio-contents/main/certificates/wadhwani-certificate.png",
    repoUrl: "https://github.com/ZAndrie/portfolio-contents/blob/main/certificates/wadhwani-certificate.png",
    order: 3
  },
  {
    id: "cert-1792828485965",
    title: "Canva Essentials",
    issuer: "The Canva Teams",
    date: "October 30, 2026",
    imageUrl: "https://raw.githubusercontent.com/ZAndrie/portfolio-contents/main/certificates/canva-essentials.jpg",
    repoUrl: "https://github.com/ZAndrie/portfolio-contents/blob/main/certificates/canva-essentials.jpg",
    order: 4
  },
  {
    id: "cert-1792828549313",
    title: "Cyber Threat Management",
    issuer: "Cisco Networking Academy",
    date: "May 18, 2026",
    imageUrl: "https://raw.githubusercontent.com/ZAndrie/portfolio-contents/main/certificates/cyber-threat-management.jpg",
    repoUrl: "https://github.com/ZAndrie/portfolio-contents/blob/main/certificates/cyber-threat-management.jpg",
    order: 5
  },
  {
    id: "cert-1792828644765",
    title: "Endpoint Security",
    issuer: "Cisco Networking Academy",
    date: "May 18, 2026",
    imageUrl: "https://raw.githubusercontent.com/ZAndrie/portfolio-contents/main/certificates/endpoint-security.jpg",
    repoUrl: "https://github.com/ZAndrie/portfolio-contents/blob/main/certificates/endpoint-security.jpg",
    order: 6
  },
  {
    id: "cert-1792828772659",
    title: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    date: "April 27, 2026",
    imageUrl: "https://raw.githubusercontent.com/ZAndrie/portfolio-contents/main/certificates/introduction-to-cybersecurity.jpg",
    repoUrl: "https://github.com/ZAndrie/portfolio-contents/blob/main/certificates/introduction-to-cybersecurity.jpg",
    order: 7
  },
  {
    id: "cert-1792828890896",
    title: "Network Defense",
    issuer: "Cisco Networking Academy",
    date: "May 18, 2026",
    imageUrl: "https://raw.githubusercontent.com/ZAndrie/portfolio-contents/main/certificates/network-defense.jpg",
    repoUrl: "https://github.com/ZAndrie/portfolio-contents/blob/main/certificates/network-defense.jpg",
    order: 8
  },
  {
    id: "cert-1792829038326",
    title: "Networking Devices and Initial Configuration",
    issuer: "Cisco Networking Academy",
    date: "May 18, 2026",
    imageUrl: "https://raw.githubusercontent.com/ZAndrie/portfolio-contents/main/certificates/networking-devices-and-initial-configuration.jpg",
    repoUrl: "https://github.com/ZAndrie/portfolio-contents/blob/main/certificates/networking-devices-and-initial-configuration.jpg",
    order: 9
  }
];
