
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CalTrack - Your Personal Workout Tracker",
  description: "CalTrack - Your Personal Workout Tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      
    <head>
        <title>CalTrack - Your Personal Workout Tracker</title>
        <meta charSet="UTF-8" />    
        <link rel="icon" href="/favicon.ico" />   
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="CalTrack - Your Personal Workout Tracker" />
        <meta name="keywords" content="CalTrack, Workout Tracker, Fitness, Exercise, Health" />
        <meta name="author" content="CalTrack Team" />
        <meta property="og:title" content="CalTrack - Your Personal Workout Tracker" />
        <meta property="og:description" content="Track your workouts, monitor your progress, and achieve your fitness goals with CalTrack." />  
        
    </head>
        
      
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
    </html>
  );
}
