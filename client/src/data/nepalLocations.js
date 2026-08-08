// src/data/nepalLocations.js
export const provinces = [
  'Province 1', 'Province 2', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'
];

export const districts = {
  'Province 1': ['Bhojpur', 'Dhankuta', 'Ilam', 'Jhapa', 'Khotang', 'Morang', 'Okhaldhunga', 'Panchthar', 'Sankhuwasabha', 'Solukhumbu', 'Sunsari', 'Taplejung', 'Tehrathum', 'Udayapur'],
  'Province 2': ['Bara', 'Parsa', 'Dhanusha', 'Mahottari', 'Sarlahi', 'Siraha', 'Rautahat'],
  'Bagmati': ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Makwanpur', 'Dhading', 'Nuwakot', 'Rasuwa', 'Sindhupalchok', 'Kavrepalanchok', 'Dolakha', 'Ramechhap', 'Sindhuli'],
  'Gandaki': ['Gorkha', 'Lamjung', 'Tanahun', 'Kaski', 'Manang', 'Mustang', 'Myagdi', 'Nawalpur', 'Parbat', 'Syangja', 'Baglung'],
  'Lumbini': ['Kapilvastu', 'Nawalparasi', 'Rupandehi', 'Arghakhanchi', 'Gulmi', 'Palpa', 'Dang', 'Pyuthan', 'Rolpa', 'Eastern Rukum', 'Banke', 'Bardiya'],
  'Karnali': ['Western Rukum', 'Salyan', 'Dolpa', 'Humla', 'Jumla', 'Kalikot', 'Mugu', 'Surkhet', 'Dailekh', 'Jajarkot'],
  'Sudurpashchim': ['Kailali', 'Kanchanpur', 'Doti', 'Achham', 'Bajhang', 'Bajura', 'Dadeldhura', 'Darchula', 'Baitadi']
};

export const municipalities = {
  'Kathmandu': ['Kathmandu Metropolitan', 'Tokha', 'Budhanilkantha', 'Tarakeshwar', 'Gokarneshwar', 'Chandragiri', 'Dakshinkali', 'Kirtipur', 'Nagarjun'],
  'Lalitpur': ['Lalitpur Metropolitan', 'Godawari', 'Mahalaxmi', 'Bagmati'],
  'Bhaktapur': ['Bhaktapur Metropolitan', 'Madhyapur Thimi', 'Changunarayan', 'Suryabinayak'],
  // Add more municipalities as needed
};

export const wards = Array.from({ length: 32 }, (_, i) => `${i + 1}`);