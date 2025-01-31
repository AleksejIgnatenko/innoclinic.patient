import './../styles/ServiceCard.css';

const ServiceCard = ({serviceName, price}) => {
    return (
        <div class="service-card">
        <div class="service-card__info">
            <h2 class="service-card__title">{serviceName}</h2>
            <p class="service-card__description">{price}</p>
        </div>
    </div>
    );
};

export default ServiceCard;