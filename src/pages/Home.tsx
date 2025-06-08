import Header from "../components/Header";
import MapContainer from "../components/MapContainer";
import Sidebar from "../components/Sidebar";
import InitialSearchScreen from "../components/InitialSearchScreen";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <MapContainer />
        <InitialSearchScreen />
      </div>
    </div>
  );
}