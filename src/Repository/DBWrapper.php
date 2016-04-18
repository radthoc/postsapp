<?php
include_once __DIR__ .
    DIRECTORY_SEPARATOR .
    '..' .
    DIRECTORY_SEPARATOR .
    'Persistence' .
    DIRECTORY_SEPARATOR .
    'MYSQLHandler.php';

class DBWrapper
{
    const PROCESS = 'DBWrapper';
    private $dBHandler;
    private $operators = [
        '=',
        '!=',
        '<',
        '>',
        '<=',
        '>='
    ];

    public function __construct()
    {
        $this->dBHandler = new MYSQLHandler;
    }

    public function findAll($table, $orderBy = "''")
    {
        if (empty($table)) {
            throw new \Exception(self::PROCESS . '- function findAll - ' . 'Parameter table is empty');
        }

        $sql = sprintf(
            "select * from %s order by %s",
            $table,
            $orderBy
        );

        return $this->dBHandler->getResults($sql, []);
    }

    public function findOneBy($table, $field, $value)
    {
        $query = 'SELECT * FROM ' . $table .
            ' WHERE '. $field .
            ' = ?';

        $params[] = $value;

        return $this->dBHandler->getRow($query, $params);
    }

    public function findQuery($query, array $params = [])
    {
        if (empty($query)) {
            throw new \Exception(self::PROCESS . '- function findQuery - ' . 'Parameter query is empty');
        }

        return $this->dBHandler->getResults($query, $params);
    }

    public function persist($table, array $variables)
    {
        if (empty($table) || empty($variables)) {
            throw new \Exception(self::PROCESS . '- function persist - ' . 'One or more parameters are empty');
        }

        $query = "INSERT INTO " . $table;

        $fields = [];
        $values = [];

        foreach ($variables as $field => $value) {
            $fields[] = $field;
            $values[] = '?';
            $params[] = $value;
        }

        $query .= ' (' . implode(', ', $fields) . ')' . ' VALUES ' . '(' . implode(', ', $values) . ');';

        $this->dBHandler->insert($query, $params);

        return $this->dBHandler->lastId();
    }

    public function update($table, array $data, array $where, $limit = null)
    {
        $result = false;

        if (empty($table) || empty($data) || empty($where)) {
            throw new \Exception(self::PROCESS . '- function update - ' . 'One or more parameters are empty');
        }

        if ($this->dBHandler->update($table, $data, $where, $limit)) {
            $result = $this->dBHandler->affected() > 0;
        }

        return $result;
    }

    public function lastID()
    {
        return $this->dBHandler->lastId();
    }
}
