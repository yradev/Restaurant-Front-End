export default function ImageContent({title, content, image}) {
    return (
        <div className="section-image-content">
            <div className="shell shell--small">
                <div className="section__inner">
                    <div className="section__image">
                        <img src={image} alt="" />
                    </div>

                    <div className="section__content">
                        <h2>{title}</h2>

                        <p>{content}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}