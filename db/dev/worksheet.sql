-- select * from cores_staging.core_35d0b64b_879b_4540_a037_876eb7a74af9;
-- select * from core;
-- select * from data_point_type;
-- select * from series;
-- select * from sample;
-- select * from data_point;

-- delete from data_point;
-- delete from sample;
-- delete from series;
-- delete from data_point_type;



-- select * from corz.vw_core_data;
-- 
-- select * from corz.vw_core_summary;

-- CREATE INDEX ON corz.sample(core_id);
-- CREATE INDEX ON corz.data_point(sample_id);

SELECT
    c.id,
    c.name,
    sa.id as sample_id,
    sa.top_depth,
    sa.bottom_depth,
    sa.top_age,
    sa.bottom_age
    ,( select json_agg(data)
      from (
        select dpt.name, dp.value 
        from corz.data_point_type dpt
        join corz.data_point dp on dp.data_point_type_id = dpt.id
        join corz.sample sam on dp.sample_id = sam.id
        where sam.id = sa.id
      ) as data
    ) as data
    from corz.core c
    join corz.sample sa on sa.core_id = c.id
    order by sa.top_depth
