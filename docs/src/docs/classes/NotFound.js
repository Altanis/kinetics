export default function NotFound() {
    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <h1 className="text-4xl text-white mb-4">Oops! Page not found</h1> 
                <p className="text-lg text-white mb-8">The page you are looking for does not exist.</p>
                <a href="/" className="text-accent hover:text-rose-600 duration-300">Go back to the homepage</a>
            </div>
        </>
  );
};