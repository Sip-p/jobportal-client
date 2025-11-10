import { AppContext } from '../context/AppContext';
import { useContext, useEffect, useState } from 'react';
import { assets, JobCategories, JobLocations } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const JobListing = () => {
  const { searchFilter, isSearched, setSearchFilter } = useContext(AppContext);
  const { backendUrl, appliedJobs, setAppliedJobs, userData } = useContext(AppContext);

  const [alljob, setAlljob] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [locationFilter, setLocationFilter] = useState([]);

  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 6;

  // ✅ Fetch jobs
  const getAllJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs`);
      if (data.success) setAlljob(data.jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch jobs");
    }
  };

  useEffect(() => {
    getAllJobs();
  }, []);

  // ✅ Apply handler
  const applyHandler = (jobId) => {
    if (!userData) return toast.error('Login to apply for job');
    if (!userData.resume) {
      navigate('/applications');
      return toast.error("Upload resume to apply");
    }
    navigate(`/apply-job/${jobId}`);
  };

  // ✅ Filters
  const handleCategoryChange = (category) => {
    setCategoryFilter(prev =>
      prev.includes(category) ? prev.filter(item => item !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handleLocationChange = (location) => {
    setLocationFilter(prev =>
      prev.includes(location) ? prev.filter(item => item !== location) : [...prev, location]
    );
    setCurrentPage(1);
  };

  const setClear = () => {
    setSearchFilter({ title: '', location: '' });
    setCategoryFilter([]);
    setLocationFilter([]);
    setCurrentPage(1);
  };

  const hasTitle = searchFilter.title.trim() !== "";
  const hasLocation = searchFilter.location.trim() !== "";
  const hasFilters = hasTitle || hasLocation || categoryFilter.length > 0 || locationFilter.length > 0;

  // ✅ Filter jobs
  const filteredJobs = isSearched && hasFilters
    ? alljob.filter(item => {
        const titleMatch = hasTitle ? item.title.toLowerCase().includes(searchFilter.title.toLowerCase()) : true;
        const locationMatch = hasLocation ? item.location.toLowerCase().includes(searchFilter.location.toLowerCase()) : true;
        const categoryFilterMatch = categoryFilter.length > 0 ? categoryFilter.includes(item.category) : true;
        const locationFilterMatch = locationFilter.length > 0 ? locationFilter.includes(item.location) : true;
        return titleMatch && locationMatch && categoryFilterMatch && locationFilterMatch;
      })
    : alljob;

  // ✅ Pagination
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="container mx-auto my-12 px-4 2xl:px-20 grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-8">
      {/* Sidebar */}
      <aside className="flex flex-col gap-6 bg-white border border-gray-200 shadow-sm p-6 rounded-xl sticky top-6 h-fit">
        {isSearched && (searchFilter.title || searchFilter.location) && (
          <div>
            <h3 className="text-gray-800 font-semibold mb-3 border-b pb-2">Current Search</h3>
            <div className="space-y-2">
              {searchFilter.title && (
                <div className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-lg">
                  <span className="text-sm text-gray-700">{searchFilter.title}</span>
                  <img
                    src={assets.cross_icon}
                    alt="Remove"
                    className="h-4 w-4 cursor-pointer hover:opacity-70 transition"
                    onClick={() => setSearchFilter({ ...searchFilter, title: '' })}
                  />
                </div>
              )}
              {searchFilter.location && (
                <div className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-lg">
                  <span className="text-sm text-gray-700">{searchFilter.location}</span>
                  <img
                    src={assets.cross_icon}
                    alt="Remove"
                    className="h-4 w-4 cursor-pointer hover:opacity-70 transition"
                    onClick={() => setSearchFilter({ ...searchFilter, location: '' })}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={setClear}
          className="w-full bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-gray-900 transition"
        >
          Clear All Filters
        </button>

        <div>
          <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Categories</h4>
          <ul className="space-y-2">
            {JobCategories.map((category, idx) => (
              <li key={idx} className="flex items-center gap-3 text-gray-700">
                <input
                  type="checkbox"
                  id={`cat-${idx}`}
                  className="h-4 w-4 accent-gray-800 cursor-pointer"
                  onChange={() => handleCategoryChange(category)}
                  checked={categoryFilter.includes(category)}
                />
                <label htmlFor={`cat-${idx}`} className="cursor-pointer hover:text-gray-900">
                  {category}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Locations</h4>
          <ul className="space-y-2">
            {JobLocations.map((location, idx) => (
              <li key={idx} className="flex items-center gap-3 text-gray-700">
                <input
                  type="checkbox"
                  id={`loc-${idx}`}
                  className="h-4 w-4 accent-gray-800 cursor-pointer"
                  onChange={() => handleLocationChange(location)}
                  checked={locationFilter.includes(location)}
                />
                <label htmlFor={`loc-${idx}`} className="cursor-pointer hover:text-gray-900">
                  {location}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Job Listings */}
      <main>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Available Job Openings</h1>

        <p className="text-gray-600 text-sm mb-6">
          Showing <strong>{startIndex + 1}-{Math.min(endIndex, filteredJobs.length)}</strong> of{" "}
          <strong>{filteredJobs.length}</strong> jobs
        </p>

        {paginatedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedJobs.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    className="h-12 w-12 rounded-full object-cover border"
                    src={item.companyId.image}
                    alt={item.companyId.name}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.companyId.name}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-5">{item.location}</p>

                <div className="flex gap-3">
                  <button
                    className={`flex-1 ${
                      appliedJobs.includes(item._id)
                        ? "bg-green-600 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white font-medium rounded-md py-2 transition`}
                    onClick={() => applyHandler(item._id)}
                    disabled={appliedJobs.includes(item._id)}
                  >
                    {appliedJobs.includes(item._id) ? "Applied ✓" : "Apply Now"}
                  </button>
                  <Link to={`/apply-job/${item._id}`}>
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 font-medium rounded-md py-2  px-2 transition">
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">No jobs found matching your filters.</p>
            <button
              onClick={setClear}
              className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredJobs.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center items-center gap-3 mt-10">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
            >
              <img src={assets.left_arrow_icon} alt="Previous" className="h-5 w-5" />
            </button>

            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={idx} className="px-2 text-gray-500">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 text-sm rounded-md flex items-center justify-center ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
            >
              <img src={assets.right_arrow_icon} alt="Next" className="h-5 w-5" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default JobListing;
