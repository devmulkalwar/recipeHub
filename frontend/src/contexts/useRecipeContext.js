import { useContext } from 'react';
import { RecipeContext } from './RecipeContext';

const useRecipe = () => useContext(RecipeContext);

export default useRecipe;
