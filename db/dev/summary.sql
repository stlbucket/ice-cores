select * from corz.vw_core_summary;

select count(*) from corz.data_point;

select distinct
  c.name
  ,(select count(*) from corz.sample where core_id = c.id) samples
  ,(select count(*) from corz.series where core_id = c.id) series
  ,(select count(*) from corz.data_point dp join corz.series s on s.id = dp.series_id and s.core_id = c.id) data_points
from corz.core c
;

