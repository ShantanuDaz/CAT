import { supabase } from './supabase'

export const fetchData = async (table, select = '*') => {
  const { data, error } = await supabase.from(table).select(select)
  return { data, error }
}

export const insertData = async (table, payload) => {
  const { data, error } = await supabase.from(table).insert(payload)
  return { data, error }
}

export const updateData = async (table, id, payload) => {
  const { data, error } = await supabase.from(table).update(payload).eq('id', id)
  return { data, error }
}

export const deleteData = async (table, id) => {
  const { data, error } = await supabase.from(table).delete().eq('id', id)
  return { data, error }
}