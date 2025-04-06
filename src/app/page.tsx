'use client'
import { motion } from 'framer-motion';
import Image from 'next/image';
import HomeAdvantage from "@/components/homeAdvantage";
import HomePresent from "@/components/homePresent";
import AboutUs from '@/components/aboutUs';
import BusinessComponent from '@/components/business';

const WelcomePage = () => {
    return (
        <div className="bg-white min-h-screen flex flex-col items-center px-6 py-10">
            
            <motion.div
                className="flex flex-col-reverse md:flex-row items-center justify-center gap-8 w-full max-w-5xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <HomePresent />
            </motion.div>

            <motion.div
                className="py-8 mt-6 w-full max-w-5xl border-t border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <HomeAdvantage />

                <motion.div
                    className="flex flex-row justify-center items-center py-8 border-t border-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <AboutUs />
                </motion.div>

                <motion.div
                    className='border-t border-gray-200'
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <BusinessComponent />
                </motion.div>
            </motion.div>
        </div>
    );
}

export default WelcomePage;
