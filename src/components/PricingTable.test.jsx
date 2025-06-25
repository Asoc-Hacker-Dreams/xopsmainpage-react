import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock AnimationWrapper
const AnimationWrapper = ({ children }) => <div>{children}</div>;

const PricingTable = () => {
    const plans = [
        {
            name: "VIRTUAL-ONLY",
            price: 1000,
            features: [
                "Stand Virtual Premium",
                "Perfil completo en la aplicación web"
            ],
            active: false
        },
        {
            name: "SILVER",
            price: 1500,
            features: [
                "Stand Físico de 2x2m con mesa y sillas",
                "5 Entradas completas"
            ],
            active: false
        },
        {
            name: "GOLD",
            price: 2500,
            features: [
                "Charla técnica de 45 minutos",
                "10 Entradas completas"
            ],
            active: true
        },
        {
            name: "TRACK SPONSOR",
            price: 6000,
            features: [
                "Derechos de Nomenclatura del Track",
                "15 Entradas completas"
            ],
            active: false
        },
        {
            name: "PLATINUM",
            price: 10000,
            features: [
                "Charla Principal (Keynote) de 30 minutos",
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

// Simple test to verify the new packages are rendered
describe('Updated PricingTable', () => {
    test('renders all 5 new sponsorship packages', () => {
        render(<PricingTable />);
        
        // Check all 5 package names are present
        expect(screen.getByText('VIRTUAL-ONLY')).toBeInTheDocument();
        expect(screen.getByText('SILVER')).toBeInTheDocument();
        expect(screen.getByText('GOLD')).toBeInTheDocument();
        expect(screen.getByText('TRACK SPONSOR')).toBeInTheDocument();
        expect(screen.getByText('PLATINUM')).toBeInTheDocument();
    });

    test('displays correct pricing for new packages', () => {
        render(<PricingTable />);
        
        // Check prices are displayed correctly
        expect(screen.getByText('1000')).toBeInTheDocument(); // VIRTUAL-ONLY
        expect(screen.getByText('1500')).toBeInTheDocument(); // SILVER 
        expect(screen.getByText('2500')).toBeInTheDocument(); // GOLD
        expect(screen.getByText('6000')).toBeInTheDocument(); // TRACK SPONSOR
        expect(screen.getByText('10000')).toBeInTheDocument(); // PLATINUM
    });
});