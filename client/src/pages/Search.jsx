import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ListingCard from "../components/ListingCard";

const Search = () => {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    parking: false,
    furnished: false,
    sort: "createdAt",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState([]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    if (name === "sort_order") {
      const sort = value.split("_")[0] || "createdAt";
      const order = value.split("_")[1] || "desc";
      setSidebardata({ ...sidebardata, sort, order });
    } else {
      setSidebardata((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("searchTerm", sidebardata.searchTerm);
    params.set("parking", sidebardata.parking);
    params.set("furnished", sidebardata.furnished);
    params.set("sort", sidebardata.sort);
    params.set("order", sidebardata.order);

    const searchQuery = params.toString();
    navigate(`/listing?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchFromUrl = urlParams.get("searchTerm");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchFromUrl || "",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListing = async () => {
      const searchQuery = urlParams.toString();
      try {
        setLoading(true);
        const res = await fetch(`/api/listing?${searchQuery}`);
        const data = await res.json();
        setLoading(false);
        setListing(data);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchListing();
  }, [location.search]);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              name="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="flex gap-2 font-semibold">Amenities:</label>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="parking"
                className="w-4 h-4"
                checked={sidebardata.parking}
                onChange={handleChange}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="furnished"
                className="w-4 h-4"
                checked={sidebardata.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label>Sort:</label>
            <select
              name="sort_order"
              id="sort_order"
              className="border rounded-lg p-3"
              defaultValue={"createdAt_desc"}
              onChange={handleChange}
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
          <Link
            to="/listing"
            className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 text-center"
          >
            Show All
          </Link>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing result:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listing.length === 0 && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}
          {loading && <p className="text-xl text-slate-700">Loading...</p>}
          {!loading &&
            listing &&
            listing.map((list) => {
              return <ListingCard key={list._id} list={list} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default Search;
