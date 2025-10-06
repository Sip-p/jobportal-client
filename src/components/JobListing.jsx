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
  const [currentPage, setCurrentPage] = useState(1); // ✅ Start from 1 for better UX
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [locationFilter, setLocationFilter] = useState([]);
  
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 6;

  // ✅ Fetch all jobs
  const getAllJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs`);
      if (data.success) {
        setAlljob(data.jobs);
      }
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
    if (!userData) {
      return toast.error('Login to apply for job');
    }
    if (!userData.resume) {
      navigate('/applications');
      return toast.error("Upload resume to apply");
    }
    // Navigate to apply page
    navigate(`/apply-job/${jobId}`);
  };

  // ✅ Filter handlers
  const handleCategoryChange = (category) => {
    setCategoryFilter(prev =>
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category]
    );
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleLocationChange = (location) => {
    setLocationFilter(prev =>
      prev.includes(location)
        ? prev.filter(item => item !== location)
        : [...prev, location]
    );
    setCurrentPage(1); // Reset to first page on filter change
  };

  const setClear = () => {
    setSearchFilter({ title: '', location: '' });
    setCategoryFilter([]);
    setLocationFilter([]);
    setCurrentPage(1);
  };

  // ✅ Check if filters are active
  const hasTitle = searchFilter.title.trim() !== "";
  const hasLocation = searchFilter.location.trim() !== "";
  const hasFilters = hasTitle || hasLocation || categoryFilter.length > 0 || locationFilter.length > 0;

  // ✅ Filter jobs
  const filteredJobs = isSearched && hasFilters
    ? alljob.filter(item => {
        const titleMatch = hasTitle
          ? item.title.toLowerCase().includes(searchFilter.title.toLowerCase())
          : true;

        const locationMatch = hasLocation
          ? item.location.toLowerCase().includes(searchFilter.location.toLowerCase())
          : true;

        const categoryFilterMatch = categoryFilter.length > 0
          ? categoryFilter.includes(item.category)
          : true;

        const locationFilterMatch = locationFilter.length > 0
          ? locationFilter.includes(item.location)
          : true;

        return titleMatch && locationMatch && categoryFilterMatch && locationFilterMatch;
      })
    : alljob;

  // ✅ Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  // ✅ Generate page numbers array
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, and pages around current
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className='container 2xl:px-20 mx-auto my-10 px-4 grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-6'>
      {/* Sidebar Filters */}
      <div className='flex flex-col gap-4 shadow-lg p-4 rounded-lg bg-gray-100 h-fit sticky top-4'>
        {/* Current Search Display */}
        {isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && (
          <div className='mb-4'>
            <h3 className='px-3 py-2 bg-gradient-to-r from-purple-800 to-purple-950 text-white rounded-t-lg'>
              Current Search
            </h3>
            <div className='mt-3 space-y-2'>
              {searchFilter.title && (
                <div className='flex items-center gap-2 p-2 bg-purple-200 rounded'>
                  <span className='flex-1'>{searchFilter.title}</span>
                  <img
                    src={assets.cross_icon}
                    alt="Remove"
                    className='h-5 w-5 cursor-pointer hover:scale-110 transition'
                    onClick={() => setSearchFilter({ ...searchFilter, title: '' })}
                  />
                </div>
              )}
              {searchFilter.location && (
                <div className='flex items-center gap-2 p-2 bg-purple-200 rounded'>
                  <span className='flex-1'>{searchFilter.location}</span>
                  <img
                    src={assets.cross_icon}
                    alt="Remove"
                    className='h-5 w-5 cursor-pointer hover:scale-110 transition'
                    onClick={() => setSearchFilter({ ...searchFilter, location: '' })}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={setClear}
          className='bg-gradient-to-r from-purple-800 to-purple-950 p-2 rounded-lg text-white hover:from-purple-900 hover:to-black transition'
        >
          Clear All Filters
        </button>

        {/* Categories */}
        <div className='border-t pt-4'>
          <h4 className='text-2xl font-semibold mb-3'>Categories</h4>
          <ul className='space-y-2'>
            {JobCategories.map((category, idx) => (
              <li key={idx} className='flex items-center gap-3'>
                <input
                  type='checkbox'
                  id={`cat-${idx}`}
                  className='h-5 w-5 cursor-pointer'
                  onChange={() => handleCategoryChange(category)}
                  checked={categoryFilter.includes(category)}
                />
                <label htmlFor={`cat-${idx}`} className='text-base cursor-pointer'>
                  {category}
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Locations */}
        <div className='border-t pt-4'>
          <h4 className='text-2xl font-semibold mb-3'>Locations</h4>
          <ul className='space-y-2'>
            {JobLocations.map((location, idx) => (
              <li key={idx} className='flex items-center gap-3'>
                <input
                  type='checkbox'
                  id={`loc-${idx}`}
                  className='h-5 w-5 cursor-pointer'
                  onChange={() => handleLocationChange(location)}
                  checked={locationFilter.includes(location)}
                />
                <label htmlFor={`loc-${idx}`} className='text-base cursor-pointer'>
                  {location}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Job Listings */}
      <div>
        <h1 className='text-3xl font-bold shadow-xl p-4 bg-gradient-to-r from-purple-800 to-purple-950 rounded-lg text-white text-center mb-6'>
          Latest Jobs
        </h1>

        {/* Results count */}
        <p className='text-gray-600 mb-4 px-4'>
          Showing {startIndex + 1}-{Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length} jobs
        </p>

        {/* Job Cards */}
        {paginatedJobs.length > 0 ? (
          <div id='joblist' className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
            {paginatedJobs.map((item, idx) => (
              <div
                key={item._id}
                className='border border-gray-300 shadow-lg p-6 rounded-lg hover:shadow-2xl transition-all duration-300'
              >
                <img className='h-16 w-16 mb-3 object-contain' src={item.companyId.image} alt={item.companyId.name} />
                <h3 className='text-xl font-semibold mb-1'>{item.title}</h3>
                <p className='text-sm text-gray-600 mb-1'>{item.companyId.name}</p>
                <p className='text-sm text-gray-500 mb-4'>{item.location}</p>
                
                <div className='flex gap-2 mt-4'>
                  <button
                    className={`${
                      appliedJobs.includes(item._id)
                        ? 'bg-green-500'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } rounded-full px-4 py-2 text-white transition`}
                    onClick={() => applyHandler(item._id)}
                    disabled={appliedJobs.includes(item._id)}
                  >
                    {appliedJobs.includes(item._id) ? 'Applied ✓' : 'Apply Now'}
                  </button>
                  <Link to={`/apply-job/${item._id}`}>
                    <button className='bg-gray-300 hover:bg-gray-400 rounded-full px-4 py-2 transition'>
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>No jobs found matching your filters</p>
            <button
              onClick={setClear}
              className='mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700'
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredJobs.length > ITEMS_PER_PAGE && (
          <div className='flex justify-center items-center gap-2 mt-8'>
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition ${
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-200 cursor-pointer'
              }`}
            >
              <img src={assets.left_arrow_icon} alt='Previous' className='h-6 w-6' />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, idx) => (
              page === '...' ? (
                <span key={`ellipsis-${idx}`} className='px-2'>...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-blue-400 hover:text-white'
                  }`}
                >
                  {page}
                </button>
              )
            ))}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition ${
                currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-200 cursor-pointer'
              }`}
            >
              <img src={assets.right_arrow_icon} alt='Next' className='h-6 w-6' />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListing;