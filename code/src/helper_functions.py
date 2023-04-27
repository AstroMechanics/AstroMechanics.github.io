import rebound
import numpy as np
import numpy.ma as ma
from scipy.spatial import distance_matrix

#silence divide by zero error in get_acclerations (this is dealt with later).
np.seterr(divide='ignore')

#This should only be imported once
G=4*np.pi**2
def load_initials(filename):
    outray = np.load(filename)
    mvec = outray[:,0]
    rvec = outray[:,1:4]
    vvec = outray[:,4:]
    G = 4*np.pi**2
    return G, mvec, rvec, vvec

def get_acclerations(rvecs,masses):
    #get x,y,z components of each particle
    xs = rvecs[:,0]
    ys = rvecs[:,1]
    zs = rvecs[:,2]
    #get the differences matrix x_n - x_m for each set of elements. repeat for y & z
    dxs = xs-xs[:,None]
    dys = ys-ys[:,None]
    dzs = zs-zs[:,None]
    
    #get distances between all the points.
    dmat = distance_matrix(rvecs,rvecs)
    mass_prod = np.tile(masses, (len(rvecs), 1)) #make a matrix full of mass rows
    acc_mag = (G*mass_prod)/(dmat**3) #technically I divide by zero here, but I fix it later.
    np.fill_diagonal(acc_mag, 0) #get rids of infinite self-acclerations

    #here's the accleration vectors
    axs = acc_mag * dxs
    ays = acc_mag * dys
    azs = acc_mag * dzs
    #sum them up and make a new matrix
    acc_total = np.stack((np.sum(axs,1),np.sum(ays,1),np.sum(azs,1))).T
    return acc_total

def get_PE(Rs,mvec):
    U = np.zeros(len(Rs))
    for i in range(len(Rs)):
        distances = distance_matrix(Rs[i],Rs[i])
        m_mat = mvec * mvec[:,None]
        prod = -(G/2)*(m_mat/distances) #these are all the potentials (double counted)
        np.fill_diagonal(prod, 0) #get rids of infinite self-potentials
        U[i] = np.sum(prod)
    return U

def get_KE(Vs,mvec):
    KE = np.zeros(len(Vs))
    for i in range(len(Vs)):
        KE[i] = np.sum(0.5*mvec * np.linalg.norm(Vs[i],axis=1)**2 )
    return KE

def cart2kep(mvec,rvec,vvec):
    sim = rebound.Simulation()
    sim.units = ('yr', 'AU', 'Msun')
    for i in range(len(rvec)):
        sim.add(m=mvec[i],x=rvec[i][0],y=rvec[i][1],z=rvec[i][2],vx=vvec[i][0],vy=vvec[i][1],vz=vvec[i][2])

    out = []
    for i in range(len(rvec)-1):
        orb=sim.calculate_orbits()[i]
        out.append([orb.a,orb.e,orb.inc,orb.omega,orb.Omega,orb.M])
    return np.array(out)

def kep2cart(mvec,rp,vp,keplem):
    sim = rebound.Simulation()
    sim.units = ('yr', 'AU', 'Msun')
    #orbital elements of the primary are undefined. 
    sim.add(m=mvec[0],x=rp[0],y=rp[1],z=rp[2],vx=vp[0],vy=vp[1],vz=vp[2])
    for i in range(len(kepelem)):
        sim.add(m=mvec[i+1],a=kepelem[i][0],e=kepelem[i][1],inc=kepelem[i][2],omega=kepelem[i][3],Omega=kepelem[i][4],M=kepelem[i][5])

    vvecs = []
    for i in range(len(sim.particles)):
        vvecs.append([sim.particles[i].vx,sim.particles[i].vy,sim.particles[i].vz])
    rvecs = []
    for i in range(len(sim.particles)):
        rvecs.append([sim.particles[i].x,sim.particles[i].y,sim.particles[i].z])
    
    return np.array(rvecs),np.array(vvecs)

def cart2res(mvec,Rs,Vs):
    out = []
    for j in range(len(Rs)):
        rs = Rs[j]
        vs = Vs[j]
        sim = rebound.Simulation()
        sim.units = ('yr', 'AU', 'Msun')
        for i in range(len(rs)):
            sim.add(m=mvec[i],x=rs[0,i],y=rs[1,i],z=rs[2,i],vx=vs[0,i],vy=vs[1,i],vz=vs[2,i])
        row = []
        for i in range(len(rvec)-1):
            orb=sim.calculate_orbits()[i]
            row.append([orb.omega+orb.Omega,orb.l])
        out.append(row)
    return np.array(out)

def get_angle(mvec,Rs,Vs):
    out = cart2res(mvec,Rs,Vs)
    p2varphi = out[:,0,0]
    p1varphi = out[:,1,0]
    p2longitude = out[:,0,1]
    p1longitude = out[:,1,1]
    theta = 2*p1longitude -p2longitude-p2varphi
    angle = (np.mod(theta+np.pi/2,np.pi) -np.pi/2)*(180/np.pi)
    return angle
