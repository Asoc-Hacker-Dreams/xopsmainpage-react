import React from 'react';
import AnimationWrapper from './AnimationWrapper';

const PricingTable = () => {
    const plans = [
        {
            name: "VIRTUAL-ONLY",
            price: 1000,
            features: [
                "Stand Virtual Premium",
                "Perfil completo en la aplicación web",
                "Logo, descripción y enlaces a redes sociales",
                "Vídeo promocional incrustado",
                "Chat en tiempo real con asistentes",
                "Formulario integrado para captura de leads",
                "Logo en sección 'Virtual Sponsors' de la web"
            ],
            active: false
        },
        {
            name: "SILVER",
            price: 1500,
            features: [
                "Stand Físico de 2x2m con mesa y sillas",
                "Stand Virtual Básico",
                "Logo, descripción y enlace web",
                "Logo en sección 'Silver Sponsors'",
                "Mención en publicación conjunta en redes sociales",
                "5 Entradas completas"
            ],
            active: false
        },
        {
            name: "GOLD",
            price: 2500,
            features: [
                "Todos los beneficios del paquete Silver",
                "Charla técnica de 45 minutos",
                "Logo destacado en posición superior",
                "Publicación dedicada en redes sociales",
                "Stand Virtual Mejorado con vídeo y formulario",
                "10 Entradas completas"
            ],
            active: true
        },
        {
            name: "TRACK SPONSOR",
            price: 6000,
            features: [
                "Todos los beneficios del paquete Gold",
                "Derechos de Nomenclatura del Track",
                "Branding exclusivo en la sala física",
                "Logo en cabecera de la agenda del track",
                "Mención especial al inicio de cada jornada",
                "Stand Virtual Premium en posición destacada",
                "15 Entradas completas",
                "EXCLUSIVO - Solo 2 disponibles"
            ],
            active: false
        },
        {
            name: "PLATINUM",
            price: 10000,
            features: [
                "Todos los beneficios del Track Sponsor",
                "Charla Principal (Keynote) de 30 minutos",
                "Stand Físico grande (3x2m) en posición estratégica",
                "Logo en email de bienvenida a asistentes",
                "Agradecimiento en ceremonia de apertura y clausura",
                "15 Entradas completas"
            ],
            active: false
        },
    ];

    return (
        <div id="generic_price_table">
            <section>
                <AnimationWrapper animation="fade-up" duration={1500}>
                    <div className="container">
                        <div className="row margin-top">
                            <div className="col-md-12">
                                <div className="price-heading clearfix">
                                    <h2 className="text-center">Nuestros Planes de Promoción</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container">
                        <div className="row">
                            {plans.map((plan, index) => (
                                <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={index}>
                                    <div className={`generic_content ${plan.active ? 'active' : ''} clearfix`}>
                                        <div className="generic_head_price clearfix">
                                            <div className="generic_head_content clearfix">
                                                <div className="head_bg"></div>
                                                <div className="head">
                                                    <span>{plan.name}</span>
                                                </div>
                                            </div>
                                            <div className="generic_price_tag clearfix">
                                                <span className="price">
                                                    <span className="sign">€</span>
                                                    <span className="currency">{Math.floor(plan.price)}</span>
                                                    <span className="cent">.{Math.round((plan.price % 1) * 100)}</span>
                                                    <span className="month">/INVERSIÓN</span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="generic_feature_list">
                                            <ul>
                                                {plan.features.map((feature, featureIndex) => (
                                                    <li key={featureIndex}><span>{feature}</span></li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="generic_price_btn clearfix">
                                            
                                            <a href="mailto:info@xopsconference.com" >CONTACT</a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </AnimationWrapper>
            </section>
        </div>
    );
}

export default PricingTable;


