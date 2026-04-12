import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useLocation, useParams } from 'react-router-dom';
import { getIngredients } from '../../services/slices/ingredientsSlice';
import { useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const ingredients = useSelector(getIngredients);

  const isModal = !!location.state?.background;

  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  const detailsContent = (
    <>
      {!isModal && (
        <h3 className='text text_type_main-large mt-30 mb-5'>
          Детали ингредиента
        </h3>
      )}
      <IngredientDetailsUI ingredientData={ingredientData} />
    </>
  );

  if (isModal) return detailsContent;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}
    >
      {detailsContent}
    </div>
  );
};
