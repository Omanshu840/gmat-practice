import { Breadcrumb } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { BASE_URL } from '../services/utils';

const Breadcrumbs = () => {
  const location = useLocation();
  let currentLink = '';
  
  const crumbs = location.pathname.split('/')
    .filter(crumb => crumb !== '')
    .map((crumb, index, array) => {
      crumb = decodeURIComponent(crumb);
      currentLink += `/${crumb}`;
      const isLast = index === array.length - 1;
      
      return (
        <Breadcrumb.Item 
          key={crumb} 
          active={isLast}
          linkAs={isLast ? 'span' : Link}
          linkProps={isLast ? {} : { to: BASE_URL + currentLink }}
        >
          {crumb.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </Breadcrumb.Item>
      );
    });
  
  return (
    <Breadcrumb className="mt-3">
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: `${BASE_URL}/` }}>Home</Breadcrumb.Item>
      {crumbs}
    </Breadcrumb>
  );
};

export default Breadcrumbs;