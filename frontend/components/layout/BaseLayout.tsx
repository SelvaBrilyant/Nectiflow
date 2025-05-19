import Header from '@/components/header';

interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <>
      <Header />
      {children}
      <footer className="bg-gray-100 py-10 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Jobpilot. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default BaseLayout; 