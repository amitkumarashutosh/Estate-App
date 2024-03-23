import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import ListingCard from "../components/ListingCard";

const Home = () => {
  const [listing, setListing] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/listing?limit=3");
        const data = await res.json();
        setListing(data);
      } catch (error) {}
    };
    fetchData();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-700">perfect</span>
          <br />
          place
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Sahara Estate is the best place to find your next perfect place to
          live.
        </div>
        <Link
          to="/listing"
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let's Start now...
        </Link>
      </div>

      <Swiper navigation>
        {listing &&
          listing.length > 0 &&
          listing.map((list) => (
            <SwiperSlide key={list._id}>
              <div
                style={{
                  background: `url(${list.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {listing && listing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to="/listing"
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {listing.map((list) => (
                <ListingCard list={list} key={list._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
