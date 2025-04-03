'use client'
import { motion } from "framer-motion";

const steps = ["1", "2", "3", "4"];

const HomeAdvantage = () => {
    return (
        <div className="flex flex-col md:flex-row justify-center items-center bg-white gap-6 p-6">
            {steps.map((step, index) => (
                <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 50 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="flex items-center"
                >
                    <div className="rounded-3xl bg-yellow-400 h-[150px] w-[150px] flex flex-col items-center justify-center shadow-lg relative">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-[40px] h-[40px] flex items-center justify-center shadow-md">
                            <h1 className="text-black text-xl font-bold">{step}</h1>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default HomeAdvantage;
