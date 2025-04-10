"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Car, Clock, CreditCard, Shield } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-6 text-center text-white">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Smart Parking System
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The future of parking management is here
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button 
              size="lg" 
              onClick={() => router.push("/login")}
              className="bg-white text-blue-600 hover:bg-blue-50 mr-4"
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push("/about")}
              className="border-white text-white hover:bg-white/10"
            >
              Learn More
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-black">Why Choose Our System?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-black">
            <FeatureCard 
              icon={<Car className="w-12 h-12 text-blue-600" />}
              title="Smart Parking"
              description="Real-time parking space monitoring and automated entry/exit system"
            />
            <FeatureCard 
              icon={<Clock className="w-12 h-12 text-blue-600" />}
              title="Time Tracking"
              description="Accurate tracking of entry and exit times for better management"
            />
            <FeatureCard 
              icon={<CreditCard className="w-12 h-12 text-blue-600" />}
              title="Digital Payments"
              description="Secure and convenient payment system with wallet integration"
            />
            <FeatureCard 
              icon={<Shield className="w-12 h-12 text-blue-600" />}
              title="Security"
              description="Advanced RFID technology for enhanced security"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      className="p-6 bg-white rounded-xl shadow-lg text-center"
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}