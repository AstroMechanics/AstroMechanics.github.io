jupyter nbconvert --execute --to notebook --inplace Euler.ipynb
jupyter nbconvert --execute --to notebook --inplace RK4.ipynb
jupyter nbconvert --execute --to notebook --inplace RK2_Midpoint.ipynb
jupyter nbconvert --execute --to notebook --inplace RK2_Heun.ipynb
jupyter nbconvert --execute --to notebook --inplace RK2_Ralston.ipynb
#now make compilation plot
jupyter nbconvert --execute --to notebook --inplace Error_Compilation.ipynb
