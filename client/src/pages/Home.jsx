import Hero from "../components/Hero";
import ContentSection from "../components/ContentSection";
import Header from "../components/Header";
import SubNav from "../components/SubNav";

export default function Home() {
  return (
    <div>
      <Header />
      <SubNav />
      <Hero />
      <ContentSection />
    </div>
  );
}
