import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden">
            <div className="hidden md:block">
                <Sidebar />
            </div>
            <main className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6 md:p-10">
                {children}
            </main>
            <MobileNav />
        </div>
    );
}
