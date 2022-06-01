INSERT INTO
    users (name, email, password)
VALUES
    (
        'Bob',
        'bo@gmail.com',
        '$ 2a $ 10 $ FB / BOAVhpuLvpOREQVmvmezD4ED /.JBIDRh70tGevYzYzQgFId2u'
    ),
    (
        'Kate',
        'ka@gmail.com',
        '$ 2a $ 10 $ FB / BOAVhpuLvpOREQVmvmezD4ED /.JBIDRh70tGevYzYzQgFId2u'
    ),
    (
        'Harry',
        'ha@gmail.com',
        '$ 2a $ 10 $ FB / BOAVhpuLvpOREQVmvmezD4ED /.JBIDRh70tGevYzYzQgFId2u'
    );

INSERT INTO
    properties (
        owner_id,
        title,
        description,
        thumbnail_photo_url,
        cover_photo_url,
        cost_per_night,
        parking_spaces,
        number_of_bathrooms,
        number_of_bedrooms,
        country,
        street,
        city,
        province,
        post_code,
        active
    )
VALUES
    (
        1,
        'Bo Resort',
        'Nothing new',
        'fake url',
        'fake url',
        189,
        2,
        2,
        2,
        'Canada',
        'Ann',
        'Toronto',
        'ON',
        'M2J',
        TRUE
    ),
    (
        2,
        'Ka Hotel',
        'Not old',
        'fake url',
        'fake url',
        299,
        2,
        1,
        2,
        'Canada',
        'Finch Ave',
        'Toronto',
        'ON',
        'M2N',
        TRUE
    ),
    (
        3,
        'Ha Motel',
        'This is not a fancy place',
        'fake url',
        'fake url',
        89,
        1,
        1,
        1,
        'Canada',
        'King St',
        'Fredericton',
        'NB',
        'E3A',
        FALSE
    );

INSERT INTO
    reservations (start_date, end_date, property_id, guest_id)
VALUES
    ('2022-02-11', '2022-02-13', 1, 1),
    ('2022-04-01', '2019-04-04', 2, 2),
    ('2021-05-13', '2021-05-14', 3, 3);

INSERT INTO
    property_reviews (
        guest_id,
        property_id,
        reservation_id,
        rating,
        message
    )
VALUES
    (
        1,
        1,
        1,
        5,
        'Great place to stay'
    ),
    (
        3,
        3,
        3,
        4,
        'Too expensive!'
    ),
    (
        2,
        2,
        2,
        5,
        'Not bad..'
    );