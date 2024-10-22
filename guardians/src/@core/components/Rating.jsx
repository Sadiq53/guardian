// import React from 'react'

// const Rating = ({name, label, value}) => {
//   return (
//     <div className='rating-star-wrap'>
//         <p>{label}</p>
//         <div className="rating-star-inputs rating">
//             {
//                 [...Array(5)].map((item, index)=>{
//                     return(
//                         <>
//                             <input type="radio" name={name} id={`${name}-rating-${5 - index}`} />
//                             <label htmlFor={`${name}-rating-${5 - index}`}></label>
//                         </>
//                     )
//                 })
//             }
//         </div>
//     </div>
//   )
// }

// export default Rating
import React from 'react';
import { Formik, Field, Form } from 'formik';

const Rating = ({ name, label }) => {
  return (
    <div className='rating-star-wrap'>
      <p>{label}</p>
      <div className="rating-star-inputs rating" role="group" aria-labelledby="my-radio-group">
        {[...Array(5)].map((_, index) => {
          const value = 5 - index;
          return (
            <React.Fragment key={value}>
                <label>
                    <Field type="radio" name={name} value={value} />
                </label>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Rating;
