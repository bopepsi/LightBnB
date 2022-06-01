SELECT
    city,
    count(*) AS total_reservation
FROM
    properties
    JOIN reservations ON reservations.property_id = properties.id
GROUP BY
    properties.city
ORDER BY
    total_reservation DESC;