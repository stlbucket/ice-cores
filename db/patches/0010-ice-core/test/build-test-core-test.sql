CREATE OR REPLACE FUNCTION corz.build_test_core()
  RETURNS corz.core AS
$BODY$
declare
  _core corz.core;
  _source_core_name text;
  _current_count integer;
  _lat_random integer;
  _lon_random integer;
  _location text;
  _data_point_type corz.data_point_type;
  _dp_types text[];
  _dp_type text;
  _src_dp_type_name text;
  _series_count integer;
  _series corz.series;
  _i integer;
begin  
  _source_core_name := 'GISP2';
  _dp_types := '{"tt_1","tt_2","tt_3","tt_4","tt_5"}';
  _series_count := (random() * 4)::integer + 1; 
  _lat_random := (random() * 10) + 70;
  _lon_random := (random() * 10) + 28;
  _location := '' || _lat_random || '°35''46.4"N ' || _lon_random || '°25''19.1"W';

  SELECT count(*) INTO _current_count FROM corz.core;

  INSERT INTO corz.core(name, location)
  SELECT
    'Test-' || _current_count::text
    ,_location
  RETURNING * INTO _core
  ;
  RAISE NOTICE 'CREATING CORE: %', _core.name;
  
  INSERT INTO corz.sample(
    core_id,
    top_depth,
    top_age,
    bottom_depth,
    bottom_age
  )
  SELECT
    _core.id
    ,src.top_depth
    ,src.top_age
    ,src.bottom_depth
    ,src.bottom_age
  FROM corz.sample src
  WHERE src.core_id = (select id from corz.core where name = _source_core_name)
  ;

  FOR _i IN 1.._series_count LOOP
    _dp_type := _dp_types[_i];
    INSERT INTO corz.data_point_type(
      name 
    )
    SELECT _dp_type
    ON CONFLICT(name)
    DO UPDATE
    SET name = _dp_type
    RETURNING *
    INTO _data_point_type
    ;

    INSERT INTO corz.series(
      core_id
      ,name
      ,data_point_type_id
    )
    SELECT
      _core.id
      ,_data_point_type.name
      ,_data_point_type.id
    RETURNING * INTO _series
    ;

    _src_dp_type_name := case when (_i % 2) = 0 then 'NO3_ppb' else 'NO3_uM' end;

    INSERT INTO corz.data_point(
      value,
      sample_id,
      data_point_type_id,
      series_id
    )
    SELECT
      src.value * ((random() - 0.5) / 10)
      ,(
        select id 
        from corz.sample 
        where core_id = _core.id 
        and top_depth = s.top_depth
      )
      ,_data_point_type.id
      ,_series.id
    FROM corz.data_point src
    join corz.sample s on src.sample_id = s.id
      and s.core_id = (select id from corz.core where name = _source_core_name)
    join corz.data_point_type dpt on dpt.id = src.data_point_type_id and dpt.name = _src_dp_type_name
    order by top_depth
    limit (select sample_count from corz.vw_core_summary where name = _source_core_name) - (random() * 2000)::integer
    ;
    
  END LOOP;

  return _core;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE STRICT SECURITY DEFINER
  COST 100;
ALTER FUNCTION corz.build_test_core()
  OWNER TO corz;
GRANT EXECUTE ON FUNCTION corz.build_test_core() TO corz_user;
REVOKE ALL ON FUNCTION corz.build_test_core() FROM public;




-- Function: build_test_core_set()

-- DROP FUNCTION build_test_core_set();

CREATE OR REPLACE FUNCTION build_test_core_set(
  _num integer
)
  RETURNS integer AS
$BODY$
declare
  _core_count integer;
begin
  FOR _core_count IN 1.._num LOOP
    PERFORM corz.build_test_core();
  END LOOP;

  select
    count(*)
  into _core_count
  from corz.core; 

  return _core_count;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE STRICT SECURITY DEFINER
  COST 100;
ALTER FUNCTION build_test_core()
  OWNER TO soro;
GRANT EXECUTE ON FUNCTION build_test_core_set() TO corz_user;
REVOKE ALL ON FUNCTION build_test_core_set() FROM public;


begin;
select * from corz.vw_core_summary;

select corz.build_test_core_set(5);

select * from corz.vw_core_summary;

rollback;
