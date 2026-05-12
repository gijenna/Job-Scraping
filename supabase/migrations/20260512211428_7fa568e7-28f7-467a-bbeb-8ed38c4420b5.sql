
ALTER TABLE public.candidates
  ADD COLUMN IF NOT EXISTS current_state text,
  ADD COLUMN IF NOT EXISTS current_city text,
  ADD COLUMN IF NOT EXISTS relocation_states text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS relocation_cities text,
  ADD COLUMN IF NOT EXISTS open_to_anywhere boolean DEFAULT false;

DO $$
DECLARE
  state_map jsonb := '{
    "AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California",
    "CO":"Colorado","CT":"Connecticut","DE":"Delaware","FL":"Florida","GA":"Georgia",
    "HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa",
    "KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland",
    "MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi","MO":"Missouri",
    "MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey",
    "NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio",
    "OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina",
    "SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont",
    "VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming",
    "DC":"District of Columbia"
  }'::jsonb;
  state_names text[];
  rec RECORD;
  loc text;
  parts text[];
  cand_state text;
  cand_city text;
  found_states text[];
  kv RECORD;
BEGIN
  state_names := ARRAY(SELECT lower(value) FROM jsonb_each_text(state_map));

  FOR rec IN SELECT id, current_location FROM public.candidates
             WHERE current_location IS NOT NULL AND current_location <> ''
               AND (current_state IS NULL OR current_state = '')
  LOOP
    loc := trim(rec.current_location);
    cand_state := NULL; cand_city := NULL;
    parts := string_to_array(loc, ',');
    IF array_length(parts,1) >= 2 THEN
      IF state_map ? upper(trim(parts[2])) THEN
        cand_state := state_map->>upper(trim(parts[2])); cand_city := trim(parts[1]);
      ELSIF lower(trim(parts[2])) = ANY(state_names) THEN
        cand_state := initcap(trim(parts[2])); cand_city := trim(parts[1]);
      ELSIF state_map ? upper(trim(parts[1])) THEN
        cand_state := state_map->>upper(trim(parts[1])); cand_city := trim(parts[2]);
      ELSIF lower(trim(parts[1])) = ANY(state_names) THEN
        cand_state := initcap(trim(parts[1])); cand_city := trim(parts[2]);
      END IF;
    END IF;
    IF cand_state IS NULL THEN
      parts := regexp_split_to_array(loc, '\s+');
      IF array_length(parts,1) >= 2 THEN
        IF state_map ? upper(parts[array_length(parts,1)]) THEN
          cand_state := state_map->>upper(parts[array_length(parts,1)]);
          cand_city := trim(array_to_string(parts[1:array_length(parts,1)-1], ' '));
        END IF;
      END IF;
    END IF;

    IF cand_state IS NOT NULL THEN
      UPDATE public.candidates
        SET current_state = cand_state,
            current_city = NULLIF(cand_city, '')
        WHERE id = rec.id;
    END IF;
  END LOOP;

  FOR rec IN SELECT id, relocation_locations FROM public.candidates
             WHERE relocation_locations IS NOT NULL AND relocation_locations <> ''
               AND (relocation_states IS NULL OR cardinality(relocation_states) = 0)
  LOOP
    loc := lower(rec.relocation_locations);
    found_states := ARRAY[]::text[];
    FOR kv IN SELECT key, value FROM jsonb_each_text(state_map)
    LOOP
      IF position(lower(kv.value) in loc) > 0
         OR rec.relocation_locations ~ ('(^|[^A-Za-z])' || kv.key || '([^A-Za-z]|$)')
      THEN
        IF NOT (kv.value = ANY(found_states)) THEN
          found_states := array_append(found_states, kv.value);
        END IF;
      END IF;
    END LOOP;
    UPDATE public.candidates
      SET relocation_states = found_states,
          relocation_cities = rec.relocation_locations,
          open_to_anywhere = (loc ~ 'anywhere')
      WHERE id = rec.id;
  END LOOP;
END $$;

CREATE INDEX IF NOT EXISTS candidates_current_state_idx ON public.candidates(current_state);
CREATE INDEX IF NOT EXISTS candidates_relocation_states_idx ON public.candidates USING GIN(relocation_states);
