import React, { useEffect, useState } from 'react';
import { CiCircleChevDown } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

const RecipeCategories = () => {
  const categories = [
    { name: 'Appetizers', img: 'https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp' },
    { name: 'Desserts', img: 'https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp' },
    { name: 'Beverages', img: 'https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp' },
    { name: 'Salads', img: 'https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp' },
    { name: 'Soups', img: 'https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp' },
    { name: 'Main Courses', img: 'https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp' },
    { name: 'Snacks', img: 'https://img.daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.webp' },
    { name: 'Healthy', img: 'https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp' },
    { name: 'Quick Bites', img: 'https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp' },
    { name: 'Kids Friendly', img: 'https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp' },
  ];

  const navigate = useNavigate();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const displayLimit = windowWidth < 768 ? 6 : windowWidth < 1024 ? 10 : 8;
const iconSize = windowWidth < 768 ? 'text-3xl' : 'text-5xl';

  const handleIconClick = () => {
    navigate('/recipes');
  };

  const renderCategories = () => {
    return categories.slice(0, displayLimit).map((category, index) => (
      <div key={index} className="flex flex-col items-center text-center">
        <img
          src={category.img}
          alt={category.name}
          className="rounded-full h-16 w-16 md:h-20 md:w-20 object-cover shadow-md"
        />
        <span className="mt-2 text-xs md:text-sm font-medium">{category.name}</span>
      </div>
    ));
  };

  return (
    <div className="py-2 px-4">     
      <div className="grid grid-cols-3 gap-3 md:grid-cols-5 lg:flex lg:overflow-x-auto">
        {renderCategories()}
        <div className="col-span-3 md:col-span-5 lg:col-span-1 flex justify-center mt-4 md:mt-6">
          <CiCircleChevDown
            onClick={handleIconClick}
            className={`cursor-pointer text-gray-600 ${iconSize}`}
          />
        </div>
      </div>
    </div>
  );
};

export default RecipeCategories;
