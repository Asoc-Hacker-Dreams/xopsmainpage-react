import React from 'react';      
import seguridadS from "../assets/collaborators/seguridad.si.jpg";
import amaxop from "../assets/collaborators/amaxop.jpeg";
import hackerD from "../assets/collaborators/hackerD.png";
import hackB from "../assets/collaborators/hackB.png";
import flaghuntersT from "../assets/collaborators/flaghuntersT.png";
import hackBcn from "../assets/collaborators/hackBcn.png";
import asturC from "../assets/collaborators/asturC.jpeg";
import madridD from "../assets/collaborators/madridD.png";
import morterueloC from "../assets/collaborators/morterueloC.png";


import AnimationWrapper from "./AnimationWrapper";


const Collaborators = () => {
  return (
    <>
      <section id="ponentes" className="speaker-section ">
        <div className="container margin-top">
          <h2 className="text-center">Gracias al patrocinio de:</h2>
          <h2 className="text-center">PLATA</h2>
          <div className="speaker-cards margin-top">


            <div className="speaker1 justify-content-center d-flex justify-around margin-top">

            <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={seguridadS} alt="Roberto Gonzalez" style={{ height: '180px', width: '200px' }} />
                </AnimationWrapper>
            </div>
  
            <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={amaxop} alt="Roberto Gonzalez" style={{ height: '180px', width: '200px' }} />
                </AnimationWrapper>
            </div>

            </div>
          </div>

          <hr />
          <hr />

          <h2 className="text-center">Gracias a la colaboracion;</h2>
          <div className="speaker-cards margin-top">

<div className="speaker1 justify-content-center d-flex justify-around margin-top">
<div className="speaker-img">
    <AnimationWrapper animation="fade-right" duration={1500}>
      <img src={hackB} alt="Roberto Gonzalez" style={{ height: '120px', width: '150px' }} />
    </AnimationWrapper>
    </div>

<div className="speaker-img">
    <AnimationWrapper animation="fade-right" duration={1500}>
      <img src={flaghuntersT} alt="Roberto Gonzalez" style={{ height: '120px', width: '150px' }} />
    </AnimationWrapper>
    </div>

<div className="speaker-img">
    <AnimationWrapper animation="fade-right" duration={1500}>
      <img src={hackBcn} alt="Roberto Gonzalez" style={{ height: '120px', width: '150px' }} />
    </AnimationWrapper>
    </div>

    <div className="speaker-img">
    <AnimationWrapper animation="fade-left" duration={1500}>
      <img src={asturC} alt="Roberto Gonzalez" style={{ height: '120px', width: '150px' }} />
    </AnimationWrapper>
</div>

<div className="speaker-img">
    <AnimationWrapper animation="fade-left" duration={1500}>
      <img src={madridD} alt="Roberto Gonzalez" style={{ height: '120px', width: '150px' }} />
    </AnimationWrapper>
</div>

</div>


<div className="speaker1 d-flex justify-content-center justify-around margin-top">
    
<div className="speaker-img">
    <AnimationWrapper animation="fade-left" duration={1500}>
      <img src={morterueloC} alt="Roberto Gonzalez" style={{ height: '120px', width: '150px' }} />
    </AnimationWrapper>
    </div>

    <div className="speaker-img">
    <AnimationWrapper animation="fade-left" duration={1500}>
      <img src={hackerD} alt="Roberto Gonzalez" style={{ height: '120px', width: '150px' }} />
    </AnimationWrapper>
    </div>

</div>


</div>
        </div>
      </section>
    </>
  );
};   

export default Collaborators;
