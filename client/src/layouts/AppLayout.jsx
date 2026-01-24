import { Navbar } from "../components/navbar/Navbar";

export function AppLayout({ children }) {
    return (
        <div>
            <Navbar />
            <main>{children}</main>
        </div>
    );
}
