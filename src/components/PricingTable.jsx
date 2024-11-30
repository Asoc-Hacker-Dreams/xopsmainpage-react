
import AnimationWrapper from './AnimationWrapper';

const PricingTable = () => {
    const plans = [
        {
            name: "DIAMANTE",
            price: 3500,
            features: [
                "Logo Grande",
                "Stand Promocion",
                "Workshop Exclusivo",
                "15 entradas"
            ],
            active: false
        },
        {
            name: "ORO",
            price: 2500,
            features: [
                "Logo Mediano",
                "Posible Stand Promocion",
                "No Workshop",
                "10 entradas"
            ],
            active: false
        },
        {
            name: "PLATA",
            price: 1000,
            features: [
                "Logo Pequeño",
                "No Stand Promocion",
                "No Workshop",
                "5 entradas"
            ]
            ,
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
                                <div className="col-lg-4 col-md-6 col-sm-12" key={index}>
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


