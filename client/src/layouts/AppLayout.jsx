import { Navbar } from "../components/navbar/Navbar";
import Footer from "../components/Footer";

export function AppLayout({ children }) {
    return (
        <div>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
