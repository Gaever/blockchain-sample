-- Поступление
select
    jsonb_build_object(
	    'id', i.id,
        'orders', orders_json,
        'values', i.*
    ) income
from income i


left join (
-- 	Ордер
	select
		o.income_id,
		jsonb_agg(
			jsonb_build_object(
				'id', o.id,
				'deals', coalesce(deals_buy_json, '[]') || coalesce(deals_sell_json, '[]'),
				'expired_outcome', jsonb_path_query_first(expired_outcomes_json, '$.values'),
-- 				'matched_orders', jsonb_path_query_array(matched_sell_orders_json,  '$[*] ? (@.id != $id)', jsonb_build_object('id', o.id))
				'values', o.*
			)
		) orders_json
	from orders o


-- 	left join (
-- -- 	Ордер, с которым совершена сделка
-- 		select
-- 		 	d1.seller_order_id,
-- 		 	jsonb_agg(
-- 		 		jsonb_build_object(
-- 		 			'id', o1.id
-- -- 		 			'values', o1.*
-- 		 		)
-- 		 	) matched_sell_orders_json
-- 		from deals d1
-- 		inner join orders o1 on d1.seller_order_id = o1.id
-- 		group by d1.seller_order_id
-- 	) d_match_sell on d_match_sell.seller_order_id = o.id

-- 	left join (
-- -- 	Ордер, с которым совершена сделка
-- 		select
-- 		 	d1.buyer_order_id,
-- 		 	d1.taker_order_id,
-- 		 	jsonb_agg(
-- 		 		jsonb_build_object(
-- 		 			'id', o1.id
-- -- 		 			'values', o1.*
-- 		 		)
-- 		 	) matched_buy_orders_json
-- 		from deals d1
-- 		inner join orders o1 on d1.buyer_order_id = o1.id
-- 		where
-- 		group by d1.buyer_order_id, d1.taker_order_id
-- 	) d_match_buy on d_match_buy.buyer_order_id = o.id




	left join (
-- 	Сделка
		select
			buyer_order_id,
			jsonb_agg(
				jsonb_build_object(
					'id', d.id,
					'outcomes', outcome_json,
					'values', d.*
				)
			) deals_buy_json
		from deals d


		left join (
-- Выплата
			select
				deal_id,
				jsonb_agg(
					jsonb_build_object(
						'id', outc.id,
						'values', outc.*
					)
				) outcome_json
			from outcome outc
			group by deal_id
		) outc on d.id = outc.deal_id
		group by d.buyer_order_id
	) d_buy
		on o.id = d_buy.buyer_order_id

	left join (
-- 	Сделка
		select
			seller_order_id,
			jsonb_agg(
				jsonb_build_object(
					'id', d.id,
					'outcomes', outcome_json,
					'values', d.*
				)
			) deals_sell_json
		from deals d


		left join (
-- Выплата
			select
				deal_id,
				jsonb_agg(
					jsonb_build_object(
						'id', outc.id,
						'values', outc.*
					)
				) outcome_json
			from outcome outc
			group by deal_id
		) outc on d.id = outc.deal_id
		group by d.seller_order_id
	) d_sell
		on o.id = d_sell.seller_order_id





	left join (
-- 	Выплата по просроченному ордеру
		select
			order_id,
			jsonb_build_object(
				'values', exp_outc.*
			) expired_outcomes_json
		from outcome exp_outc
		group by exp_outc.id
	) exp_outc on exp_outc.order_id = o.id
	group by o.id
) o on o.income_id = i.id
