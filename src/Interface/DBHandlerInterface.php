<?php

/**
 * Interface DBHandlerInterface
 */
interface DBHandlerInterface
{
    /**
     * @param $query
     * @param array $params
     * @return mixed
     */
    public function getRow($query, $params = []);

    /**
     * @param $query
     * @param array $params
     * @return mixed
     */
    public function getResults($query, $params = []);

    /**
     * @param $table
     * @param $variables
     * @return mixed
     */
    public function insert($table, $variables);

    /**
     * @param $table
     * @param $variables
     * @param $where
     * @param string $limit
     * @return mixed
     */
    public function update($table, $variables, $where, $limit = '');

    /**
     * @return mixed
     */
    public function lastId();

    /**
     * @return mixed
     */
    public function affected();
}
