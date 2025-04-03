import Image from 'next/image';
import HomeAdvantage from "@/components/homeAdvantage";
import HomePresent from "@/components/homePresent";

const WelcomePage = () => {
    return (
        <div className="bg-white min-h-screen flex flex-col items-center px-6 py-10">
            <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-8 w-full max-w-5xl">
                <HomePresent />
                <Image 
                    src={'/homeImage.png'} 
                    width={400} 
                    height={400} 
                    alt={'Home Image'} 
                    className="w-4/5 md:w-1/3 max-w-sm md:max-w-md"
                />
            </div>
            <div className="py-8 mt-6 w-full max-w-5xl border-t border-gray-200">
                <HomeAdvantage />
            </div>
        </div>
    );
}

export default WelcomePage;
